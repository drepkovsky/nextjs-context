# Shared context for NextJS app router

## Glossary
- **Shared component**: A component that is not marked as `async` and does not use the `use client` directive. These components can be imported and used by both client and server async components.
- **Shared context**: A context used by shared components, on server is cached and on client is taken from the `React.Context` API.

## Motivation
When trying to prevent 'prop drilling' in  NextJS projects that use the quite not-so-new `app router` you'll often find yourself in a situation where you need to decide whether you'll wrap the each component needing the shared context with the `use client` directive and use the regular `React.Context` API or mark every component as an `async` server component and fetch the context data inside the component itself.

This is not quite ideal for a number of reasons:
1. When using the `use client` directive you may be bringing redundant JS to the client, even if no specific client-side logic is happening inside the component.
2. When marking the component as an `async` server component you may be fetching the same data multiple times, if you are not caching the responses (NextJS does this auto for requests using `fetch`)
3. When marking the component as an `async` you may be loosing on the ability to freely compose your components, as now you are unable to import this `async` component inside a client component or a shared component that can be executed on the client.

## Solution
The solution is to use our `createNextContext` function to smoothen the DX when working with shared context in NextJS apps.
