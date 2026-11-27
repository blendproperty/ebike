import './rider.css';

export const metadata = {
  title: 'eBike Rider',
  description: 'The mobile dashboard for your e-bike',
  manifest: '/rider/manifest.webmanifest',
  icons: {
    icon: '/rider/icon-192.png',
    apple: '/rider/apple-touch-icon.png',
  },
  appleWebApp: { capable: true, title: 'eBike Rider' },
};

export const viewport = { themeColor: '#102a22' };

export default function RiderLayout({ children }) {
  return children;
}
