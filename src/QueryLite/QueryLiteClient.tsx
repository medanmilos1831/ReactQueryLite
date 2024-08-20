import { ICreateQuery, IQuery } from './types';

export class QueryLiteClient {
  private queries: {
    [key: string]: IQuery;
  } = {};

  private manageData(value: boolean) {
    return value ? { data: undefined } : {};
  }

  private generateInitQuery(key: string) {
    this.queries[key].query = {
      ...this.queries[key].query,
      isLoading: true,
      isError: false,
      ...this.manageData(this.queries[key].cacheData),
    };
  }

  private setQuery({
    key,
    promise,
    dependency,
    setRender,
    onSuccess,
    onError,
    enabled,
    cacheData,
    showLog,
  }: ICreateQuery) {
    this.queries[key] = {
      dependency: dependency != undefined ? JSON.stringify(dependency) : null,
      promise,
      setRender,
      onSuccess: onSuccess ? onSuccess : null,
      onError: onError ? onError : null,
      enabled,
      cacheData,
      showLog,
      query: {
        isLoading: enabled,
        ...this.manageData(cacheData),
        isError: false,
      },
    };
    if (!enabled) return;
    this.promiseHandler(key);
  }

  private launchQuery({ key, dependency, enabled, promise }: ICreateQuery) {
    this.queries[key] = {
      ...this.queries[key],
      promise,
      dependency: JSON.stringify(dependency),
      enabled,
    };
    if (!enabled) return;
    this.generateInitQuery(key);
    this.promiseHandler(key);
  }

  private invalidQuery(key: string) {
    if (!this.queries[key]) {
      console.warn(`${key} doesn't exist!`);
      return;
    }
    if (!this.queries[key].enabled) {
      return;
    }
    this.generateInitQuery(key);
    this.renderer(key);
    this.promiseHandler(key);
  }

  private renderer(key: string) {
    this.queries[key].setRender((prev) => prev + 1);
  }

  private async promiseHandler(key: string) {
    try {
      const response = await this.queries[key].promise();
      if (this.queries[key].cacheData) {
        this.queries[key].query.data = response.data;
      }
      if (this.queries[key].onSuccess) {
        this.queries[key].onSuccess!(response);
      }
    } catch (error) {
      this.queries[key].query.isError = true;
      if (this.queries[key].onError) {
        this.queries[key].onError!(error);
      }
    } finally {
      this.queries[key].query.isLoading = false;
      this.renderer(key);
    }
  }

  private onChange(queryObject: ICreateQuery) {
    if (
      this.queries[queryObject.key].dependency != undefined &&
      this.queries[queryObject.key] &&
      this.queries[queryObject.key].dependency !=
        JSON.stringify(queryObject.dependency)
    ) {
      this.launchQuery(queryObject);
    }
  }

  private getLog(key: string, onClear?: boolean) {
    if (onClear) {
      console.log(
        `%cREMOVED QUERY KEY: ${key}`,
        'background: red; color: white'
      );
      console.log('%cQUERY', 'background: yellow; color: black', this.queries);
      return;
    }
    console.log(
      `%cACTIVE QUERY KEY: ${key}`,
      'background: green; color: white'
    );
    console.log(
      '%cQUERY STATE',
      'background: yellow; color: black',
      this.queries[key]?.query
    );
  }

  createQuery(queryObject: ICreateQuery) {
    // INIT
    if (!this.queries[queryObject.key]) {
      this.setQuery(queryObject);
    }
    // END :: INIT

    // ON DEPENDENCY CHANGE
    this.onChange(queryObject);
    // END :: ON DEPENDENCY CHANGE
    if (queryObject.showLog) {
      this.getLog(queryObject.key);
    }
    return this.queries[queryObject.key].query;
  }

  invalidate(key: any) {
    this.invalidQuery(key);
  }

  clearCache(key: string) {
    !this.queries[key]
      ? console.warn(`${key} does not exist!`)
      : (() => {
          let showLog = this.queries[key].showLog;
          delete this.queries[key];
          if (showLog) {
            this.getLog(key, true);
          }
        })();
  }
}
