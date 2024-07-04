'use client'

import { createContext, useContext, useState, type PropsWithChildren } from 'react'

export const Context = createContext<Record<string, any>>({})

export function ContextProvider(props: PropsWithChildren<{ value: any; contextKey: string }>) {
  const oldContext = useContext(Context)

  const [context, setContext] = useState({
    ...structuredClone(oldContext),
    [props.contextKey]: props.value,
  })

  return <Context.Provider value={context}>{props.children}</Context.Provider>
}
