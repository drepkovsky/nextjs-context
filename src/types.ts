export type ContextFactory<TParams = undefined, TContext = unknown> = TParams extends undefined
  ? () => Promise<TContext>
  : (params: TParams) => Promise<TContext>

export type ProviderProps<TContext> = {
  value: TContext
  children?: React.ReactNode
}