export const config = { runtime: 'edge' }

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const xanoPath = url.pathname.replace(/^\/api\/proxy/, '')
  const xanoBase = process.env.XANO_BASE_URL ?? ''
  const xanoOrigin = xanoBase.split('/api:')[0]
  // Les assets /vault/ sont publics et accessibles sur l'origine seule (sans le chemin API)
  const xanoUrl = xanoPath.startsWith('/vault/')
    ? `${xanoOrigin}${xanoPath}${url.search}`
    : `${xanoBase}${xanoPath}${url.search}`

  // Logout géré par le proxy : efface le cookie sans appeler Xano
  // Adapter ce chemin au endpoint logout de votre API.
  // Il doit correspondre exactement à ce que le front appelle,
  // pas à ce qui existe dans Xano (Xano n'est jamais appelé ici).
  if (xanoPath === '/auth/logout' && request.method === 'POST') {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'token=; Max-Age=0; Path=/; SameSite=None; Secure; HttpOnly',
      },
    })
  }

  const cookieHeader = request.headers.get('cookie') ?? ''
  let token: string | null = null
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim()
    if (trimmed.startsWith('token=')) {
      token = trimmed.slice('token='.length) || null
      break
    }
  }

  const headers = new Headers()
  headers.set('Content-Type', request.headers.get('content-type') ?? 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const xDataSource = request.headers.get('x-data-source')
  if (xDataSource) {
    headers.set('X-Data-Source', xDataSource)
  }

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.arrayBuffer()
      : undefined

  const xanoResponse = await fetch(xanoUrl, {
    method: request.method,
    headers,
    body,
  })

  const responseHeaders = new Headers(xanoResponse.headers)
  responseHeaders.delete('access-control-allow-origin')
  responseHeaders.delete('access-control-allow-credentials')
  responseHeaders.delete('access-control-allow-headers')
  responseHeaders.delete('access-control-allow-methods')

  // Force Path=/ sur tous les Set-Cookie : sans ça le navigateur scope
  // le cookie au sous-chemin /api/proxy/auth/ et ne l'envoie pas
  // aux autres routes
  const rawSetCookie = xanoResponse.headers.get('set-cookie')
  if (rawSetCookie) {
    const fixed = rawSetCookie
      .replace(/;\s*[Pp]ath=[^;,]*/g, '')
      .replace(/;\s*[Dd]omain=[^;,]*/g, '')
      + '; Path=/'
    responseHeaders.set('set-cookie', fixed)
  }

  return new Response(xanoResponse.body, {
    status: xanoResponse.status,
    headers: responseHeaders,
  })
}
