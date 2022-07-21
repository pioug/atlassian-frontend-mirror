import { JsonLd } from 'json-ld-types';
import { CardClient, EnvironmentsKeys } from '@atlaskit/link-provider';

class CustomClient extends CardClient {
  response?: JsonLd.Response;

  constructor(envKey?: EnvironmentsKeys, response?: JsonLd.Response) {
    super(envKey);
    this.response = response;
  }

  fetchData(url: string) {
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
