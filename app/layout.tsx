import type { Metadata } from 'next';
import React from 'react';
import { Providers } from './providers';

export const metadata: Metadata = {
    title: 'SK Novel',
    description: 'Premium novel reading and writing platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <script dangerouslySetInnerHTML={{
                    __html: `
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                fontFamily: {
                  sans: ['Inter', 'sans-serif'],
                  serif: ['Merriweather', 'serif'],
                },
                colors: {
                  brand: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    900: '#0c4a6e',
                  }
                }
              }
            }
          }
        `}} />
            </head>
            <body className="bg-gray-50 text-gray-900 antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
