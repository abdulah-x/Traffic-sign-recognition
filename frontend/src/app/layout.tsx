import './globals.css'

export const metadata = {
  title: 'Traffic Sign Recognition',
  description: 'Upload and detect traffic signs'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}