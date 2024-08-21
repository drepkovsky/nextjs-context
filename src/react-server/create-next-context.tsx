import { cache, use } from 'react'
import { ContextProvider } from '../react-client/provider'
import type { ContextFactory, ProviderProps } from '../types'

export function createNextContext<TParams = undefined, TContext = unknown>(
  contextKey: string,
  factory: ContextFactory<TParams, TContext>
) {
  const lastArgs = cache(() => ({ args: undefined as TParams | undefined }))

  const fetchContext = cache((args: TParams | undefined) => {
    lastArgs().args = args
    return (
      args === undefined ? (factory as () => Promise<TContext>)() : factory(args)
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

  return [Provider, useContext, fetchContext] as const
}
