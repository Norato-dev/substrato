import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ui/Toast';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Substrato', template: '%s · Substrato' },
  description: 'Una comunidad de ideas que crecen. Ensayos, exploraciones y pensamiento orgánico.',
  openGraph: {
    title: 'Substrato',
    description: 'Una comunidad de ideas que crecen.',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: { card: 'summary_large_image', title: 'Substrato' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}