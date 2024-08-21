'use client'

import { useContext as useReactContext } from 'react'
import type { ContextFactory, CreateNextContextReturn, ProviderProps } from '../types'
import { Context, ContextProvider } from './provider'

export function createNextContext<TParams = undefined, TContext = unknown>(
  contextKey: string,
  factory: ContextFactory<TParams, TContext>
): CreateNextContextReturn<TParams, TContext> {
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

  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  const fetchContext = async (params: TParams extends undefined ? void : TParams) => {
    return (
      params === undefined
        ? (factory as () => Promise<TContext>)()
        : (factory as (params: TParams) => Promise<TContext>)(params as TParams)
    ) as TContext
  }

  return [Provider, useContext, fetchContext] as const
}
