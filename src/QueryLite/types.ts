export interface IQuery {
  cacheData: boolean;
  dependency: string | null;
  enabled: boolean;
  onError: ((err: any) => void) | null;
  onSuccess: ((data: any) => void) | null;
  promise: () => Promise<any>;
  showLog: boolean;
  query: {
    isLoading: boolean;
    isError: boolean;
    data?: any;
  };
  setRender: React.Dispatch<React.SetStateAction<number>>;
}

export interface ICreateQuery {
  key: string;
  promise: () => Promise<any>;
  dependency?: any;
  setRender: React.Dispatch<React.SetStateAction<number>>;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  enabled: boolean;
  cacheData: boolean;
  showLog: boolean;
}

export interface IUseFetch
  extends Omit<
    ICreateQuery,
    'enabled' | 'cacheData' | 'setRender' | 'showLog'
  > {
  enabled?: boolean;
  cacheData?: boolean;
  showLog?: boolean;
}
