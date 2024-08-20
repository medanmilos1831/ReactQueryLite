import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { QueryLiteClient } from './QueryLiteClient';
import { IUseFetch } from './types';

export const QueryLiteContext = createContext<QueryLiteClient | undefined>(
  undefined
);

const QueryLiteProvider = ({
  children,
  client,
}: PropsWithChildren<{ client: QueryLiteClient }>) => {
  return (
    <QueryLiteContext.Provider value={client}>
      {children}
    </QueryLiteContext.Provider>
  );
};

const useFetch = ({
  key,
  promise,
  dependency,
  onSuccess,
  onError,
  enabled = true,
  cacheData = true,
  showLog = false,
}: IUseFetch) => {
  const client = useContext(QueryLiteContext)!;
  const [_, setRender] = useState(0);
  useEffect(() => {
    return () => {
      client.clearCache(key);
    };
  }, []);
  return client.createQuery({
    key,
    promise,
    dependency,
    onSuccess,
    onError,
    enabled,
    cacheData,
    setRender,
    showLog,
  });
};

const useClient = () => {
  const client = useContext(QueryLiteContext)!;

  return {
    invalidate: (key: string) => client.invalidate(key),
    clearCache: (key: string) => client.clearCache(key),
    getClient: () => {
      return client;
    },
  };
};

const useAction = <T extends {}, R = unknown>(
  execute: (payload: R) => Promise<T>,
  config?: {
    onSuccess?: (data: T, payload: R) => void;
    onError?: (error: any, payload: R) => void;
  }
) => {
  const [state, setState] = useState({
    loading: false,
    isError: false,
  });
  return {
    action: async (payload: R) => {
      setState((prev: any) => {
        return {
          ...prev,
          loading: true,
          isError: false,
        };
      });
      try {
        const data = await execute(payload);
        if (config?.onSuccess) {
          config.onSuccess(data, payload);
        }
      } catch (error) {
        if (config?.onError) {
          config.onError(error, payload);
        }
        setState((prev) => {
          return {
            ...prev,
            isError: true,
          };
        });
      } finally {
        setState((prev) => {
          return {
            ...prev,
            loading: false,
          };
        });
      }
    },
    ...state,
  };
};

export { QueryLiteProvider, useClient, useFetch, useAction };
