/** @type {import('next').NextConfig} */

/**
 * The site is fully static and has no auth, cookies, or user input, so these
 * headers are defense in depth rather than a fix for a known hole. The CSP is
 * the meaningful one: it constrains what a future dependency compromise or
 * injected markup could do. 'unsafe-inline' for styles is required by Next's
 * style handling; scripts are restricted to same-origin plus Vercel Analytics.
 */
// Next's dev-mode hot reload (React Refresh) compiles modules with eval, so
// development needs 'unsafe-eval'. The production build never does, and must
// not get it - that is the whole point of the directive.
const isDev = process.env.NODE_ENV !== 'production'

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: http://localhost:*" : ""} https://va.vercel-scripts.com https://vitals.vercel-insights.com`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ")

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework version to scanners.
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

module.exports = nextConfig
