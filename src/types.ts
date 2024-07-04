export type ContextFactory<TParams = unknown, TContext = unknown> = (
  params: TParams
) => Promise<TContext>

export type ProviderProps<TContext> = {
  value: TContext
  children?: React.ReactNode
}
