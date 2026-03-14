import './globals.css'

export const metadata = {
  title: 'HumanizeAI — Make AI text sound human',
  description: 'Paste AI-generated text and get back natural, human-sounding writing instantly.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
