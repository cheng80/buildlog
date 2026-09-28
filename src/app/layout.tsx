import type { Metadata, Viewport } from 'next';
import { Shell } from '@/components/Shell';
import { StoreProvider } from '@/lib/store';
import './globals.css';

export const metadata: Metadata = {
  title: 'buildlog',
  description: '오늘 만든 것 하나로 프로젝트를 알리세요. 같은 글이 프로젝트 타임라인에 개발 기록으로 쌓입니다.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// Follow the OS light/dark setting before first paint; the tokens switch on [data-theme="dark"].
const themeScript = `document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
