import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'JRA - Jordan Restaurants Association', template: '%s | JRA' },
  description: 'The official representative body of Jordan\'s restaurant and hospitality industry.',
  openGraph: {
    siteName: 'Jordan Restaurants Association',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
