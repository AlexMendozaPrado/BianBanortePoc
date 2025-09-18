/** @type {import('next').NextConfig} */
const nextConfig = {

  typescript: {
    // Permite que el build continúe aunque haya errores de TypeScript
    ignoreBuildErrors: false,
  },
  eslint: {
    // Permite que el build continúe aunque haya errores de ESLint
    ignoreDuringBuilds: false,
  },
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  // Configuración para Material-UI
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  // Variables de entorno públicas
  env: {
    BIAN_VERSION: '12.0.0',
    APP_NAME: 'BIAN POC - Banorte',
  },
  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
