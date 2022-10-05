import { JsonLd } from 'json-ld-types';
import { CardClient, EnvironmentsKeys } from '@atlaskit/link-provider';
import { getDefaultResponse } from './utils';

class JsonldEditorClient extends CardClient {
  onFetch?: () => JsonLd.Response | undefined;
  onResolve?: (response: JsonLd.Response) => void;
  onError?: (error: Error) => void;

  constructor(
    envKey?: EnvironmentsKeys,
    onFetch?: () => JsonLd.Response | undefined,
    onResolve?: (response: JsonLd.Response) => void,
    onError?: (error: Error) => void,
  ) {
    super(envKey);
    this.onFetch = onFetch;
    this.onResolve = onResolve;
    this.onError = onError;
  }

  fetchData(url: string) {
    if (this.onFetch) {
      const response = this.onFetch();
      if (response) {
        return Promise.resolve({
          ...response,
          data: {
            ...response?.data,
            url,
          },
        } as JsonLd.Response);
      }
    }

    return super
      .fetchData(url)
      .then((res) => {
        if (this.onResolve) {
          this.onResolve(res);
        }
        return res;
      })
      .catch((error) => {
        if (this.onError) {
          this.onError(error);
        }
        return getDefaultResponse();
      });
  }
}

export default JsonldEditorClient;
