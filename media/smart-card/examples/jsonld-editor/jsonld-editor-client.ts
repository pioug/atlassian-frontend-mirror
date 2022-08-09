import { JsonLd } from 'json-ld-types';
import { CardClient, EnvironmentsKeys } from '@atlaskit/link-provider';
import { getDefaultResponse } from './utils';

class JsonldEditorClient extends CardClient {
  response?: JsonLd.Response;
  forceFetch?: boolean;
  onErrorCallback?: (error: Error) => void;

  constructor(
    envKey?: EnvironmentsKeys,
    response?: JsonLd.Response,
    forceFetch: boolean = false,
    onErrorCallback?: (error: Error) => void,
  ) {
    super(envKey);
    this.response = response;
    this.forceFetch = forceFetch;
    this.onErrorCallback = onErrorCallback;
  }

  fetchData(url: string) {
    if (this.forceFetch) {
      return super.fetchData(url).catch((error) => {
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
        return getDefaultResponse();
      });
    }

    return Promise.resolve({
      ...this.response,
      data: {
        ...this.response?.data,
        url,
      },
    } as JsonLd.Response);
  }
}

export default JsonldEditorClient;
