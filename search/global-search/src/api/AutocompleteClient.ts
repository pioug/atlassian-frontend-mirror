import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';

export interface AutocompleteClient {
  getAutocompleteSuggestions(query: string): Promise<string[]>;
}

export class AutocompleteClientImpl implements AutocompleteClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  private createAutocompleteRequestPromise<T>(
    query: string,
  ): Promise<string[]> {
    const options: RequestServiceOptions = {
      queryParams: {
        cloudId: this.cloudId,
        query,
      },
    };

    return utils.requestService(this.serviceConfig, options);
  }

  async getAutocompleteSuggestions(query: string): Promise<string[]> {
    return this.createAutocompleteRequestPromise(query);
  }
}
