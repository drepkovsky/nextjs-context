import { cache, use } from 'react'
import { ContextProvider } from '../react-client/provider'
import type { ContextFactory, CreateNextContextReturn, ProviderProps } from '../types'

export function createNextContext<TParams = undefined, TContext = unknown>(
  contextKey: string,
  factory: ContextFactory<TParams, TContext>
): CreateNextContextReturn<TParams, TContext> {
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  const lastArgs = cache(() => ({ args: undefined as TParams extends undefined ? void : TParams }))

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  const fetchContext = cache((args: TParams extends undefined ? void : TParams) => {
    lastArgs().args = args
    return (
      args === undefined ? (factory as () => Promise<TContext>)() : factory(args as any)
    ) as Promise<TContext>
  })

  const Provider = async (props: ProviderProps<TContext>) => {
    return (
      <ContextProvider contextKey={contextKey} value={props.value}>
        {props.children}
      </ContextProvider>
    )
  }

  const useContext = () => {
    const args = lastArgs().args
    if (args === undefined && factory.length > 0) {
      throw new Error('Args required but not provided')
    }
    return use(fetchContext(args))
  }

  return [Provider, useContext, fetchContext]
}
