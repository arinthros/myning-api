const apiKey = process.env.API_KEY

/**
 * Checks that the bearer token is authorized
 * 
 * @example
 * ```ts
 * import { headers } from 'next/headers'
 * import { NextResponse } from 'next/server'
 * 
 * export default function POST(req: Request) {
 *   const headersList = headers()
 *   const token = headersList.get('authorization')
 * 
 *   if (!token || !validToken(token?.split(' ')[1])) {
 *     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *   }
 * }
 * ```
 */
export function validToken(token: string) {
  if (token === apiKey) {
    return true
  }
  return false
}