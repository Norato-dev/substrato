import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Substrato',
  description: 'Una comunidad de ideas que crecen',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}