import { JsonLd } from 'json-ld-types';
import { CardClient, EnvironmentsKeys } from '@atlaskit/link-provider';

class CustomClient extends CardClient {
  response?: JsonLd.Response;
  forceFetch?: boolean;

  constructor(
    envKey?: EnvironmentsKeys,
    response?: JsonLd.Response,
    forceFetch: boolean = false,
  ) {
    super(envKey);
    this.response = response;
    this.forceFetch = forceFetch;
  }

  fetchData(url: string) {
    if (this.forceFetch) {
      return super.fetchData(url);
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

export default CustomClient;
