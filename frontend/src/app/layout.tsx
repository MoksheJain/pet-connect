import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PetCare — Pet Health & Vaccination Records',
  description: 'Manage your pets health, vaccinations, and medical history in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="page-bg relative">
        {children}
      </body>
    </html>
  );
}
