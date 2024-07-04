'use client'

import { useContext as useReactContext } from 'react'
import type { ContextFactory, ProviderProps } from '../types'
import { Context, ContextProvider } from './provider'

export function createNextContext<TParams, TContext>(
  contextKey: string,
  factory: ContextFactory<TParams, TContext>
) {
  const Provider = (props: ProviderProps<TContext>) => {
    return (
      <ContextProvider contextKey={contextKey} value={props.value}>
        {props.children}
      </ContextProvider>
    )
  }

  const useContext = () => {
    return useReactContext(Context)[contextKey] as TContext
  }

  const fetchContext = async (params: TParams) => {
    return (await factory(params)) as TContext
  }

  return [Provider, useContext, fetchContext] as const
}
