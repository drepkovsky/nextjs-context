import { cache, use } from 'react'
import { ContextProvider } from '../react-client/provider'
import type { ContextFactory, ProviderProps } from '../types'

export function createNextContext<TParams, TContext>(
  contextKey: string,
  factory: ContextFactory<TParams, TContext>
) {
  const lastArgs = cache(
    () =>
      ({
        args: undefined,
      }) as { args: TParams }
  )

  const fetchContext = cache((args: TParams) => {
    lastArgs().args = args
    return factory(args)
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
    if (!args && factory.length > 0) throw new Error('No args provided yet')
    return use(fetchContext(args))
  }

  return [Provider, useContext, fetchContext]
}
