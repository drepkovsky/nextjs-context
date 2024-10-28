# Shared Context for NextJS App Router

## How to Install
```bash
npm install @drepkovsky/nextjs-context # or yarn, pnpm, bun, etc.
```

## How to Use

### Create a Shared Context
```ts
// theme-context.ts
import { createNextContext } from '@drepkovsky/nextjs-context'

export const [ThemeContextProvider, useThemeContext, fetchThemeContext] = createNextContext(
  'theme', // must be unique for caching and context separation
  async () => {
    const sdk = new MySdk(process.env.NEXT_PUBLIC_API_URL)
    const themeSettings = await sdk.themeSettings.get()
    return { themeSettings }
  }
)
```

### Wrap Your App with the Context Provider
```tsx
// layout.tsx

import { fetchThemeContext, ThemeContextProvider } from './theme-context'
import type { PropsWithChildren } from 'react'

export default async function RootLayout({ children }: PropsWithChildren) {
  const themeContext = await fetchThemeContext()

  return (
    <html lang='en'>
      <body>
        <ThemeContextProvider value={themeContext}>     
          {children}
          <Button/>
        </ThemeContextProvider>
      </body>
    </html>
  )
}
```

### Usage in Shared Components
```tsx
// ui/button.tsx

import { useThemeContext } from './theme-context'

export default function Button() {
  const { themeSettings } = useThemeContext()

  return (
    <button style={{ color: themeSettings.color }}>
      Click me
    </button>
  )
}
```

Now you can use Button in both client and server components without worrying about fetching the theme settings multiple times.

### Usage in Client Components
```tsx
// client/page.tsx

'use client'

import { useThemeContext } from './theme-context'

export default function Page() {
  const { themeSettings } = useThemeContext()

  return (
    <div style={{ backgroundColor: themeSettings.backgroundColor }}>
      <Button/>
    </div>
  )
}
```

### Usage in Async Components
```tsx
// async/page.tsx

export default async function Page() {
  const { themeSettings } = await fetchThemeContext() // notice that you can't use useThemeContext here

  return (
    <div style={{ backgroundColor: themeSettings.backgroundColor }}>
      <Button/>
    </div>
  )
}
```

## Glossary
- **Shared component**: A component that is not marked as `async` and does not use the `use client` directive. These components can be imported and used by both client and server async components.
- **Shared context**: A context used by shared components, cached on the server and taken from the `React.Context` API on the client.

## Motivation
When trying to prevent 'prop drilling' in NextJS projects that use the quite not-so-new `app router`, you'll often find yourself in a situation where you need to decide whether you'll wrap each component needing the shared context with the `use client` directive and use the regular `React.Context` API or mark every component as an `async` server component and fetch the context data inside the component itself.

This is not ideal for several reasons:
1. When using the `use client` directive, you may be bringing redundant JS to the client, even if no specific client-side logic is happening inside the component.
2. When marking the component as an `async` server component, you may be fetching the same data multiple times if you are not caching the responses (NextJS does this automatically for requests using `fetch`).
3. When marking the component as `async`, you may lose the ability to freely compose your components, as you are now unable to import this `async` component inside a client component or a shared component that can be executed on the client.

