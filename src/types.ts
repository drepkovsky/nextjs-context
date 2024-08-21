export type ContextFactory<TParams = undefined, TContext = unknown> = TParams extends undefined
  ? () => Promise<TContext>
  : (params: TParams) => Promise<TContext>

export type ProviderProps<TContext> = {
  value: TContext
  children?: React.ReactNode
}

export type CreateNextContextReturn<TParams = undefined, TContext = unknown> = [
  (props: ProviderProps<TContext>) => React.ReactNode,
  () => TContext,
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  (params: TParams extends undefined ? void : TParams) => Promise<TContext>
]