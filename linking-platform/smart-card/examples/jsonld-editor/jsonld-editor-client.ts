import { type JsonLd } from 'json-ld-types';
import { CardClient, type EnvironmentsKeys } from '@atlaskit/link-provider';
import { getDefaultResponse } from './utils';
import { type BatchResponse, isSuccessfulResponse, request } from './client-utils';

class JsonldEditorClient extends CardClient {
  private readonly orsBaseURL: string =
    'https://pug.jira-dev.com/gateway/api/object-resolver';
  private readonly onFetch?: () => JsonLd.Response | undefined;
  private readonly onResolve?: (response: JsonLd.Response) => void;
  private readonly onError?: (error: Error) => void;
  private readonly ari?: string;
  private readonly branchDeploy?: string;

  constructor(
    envKey?: EnvironmentsKeys,
    onFetch?: () => JsonLd.Response | undefined,
    onResolve?: (response: JsonLd.Response) => void,
    onError?: (error: Error) => void,
    ari?: string,
    branchDeploy?: string,
  ) {
    super(envKey);
    this.onFetch = onFetch;
    this.onResolve = onResolve;
    this.onError = onError;
    this.ari = ari;
    this.branchDeploy = branchDeploy;
  }

  async fetchData(url: string, force?: boolean) {
    // Return response from editor
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
    // Fetch with ari context
    if (this.ari || this.branchDeploy) {
      const data = [
        {
          resourceUrl: url,
          ...(this.ari ? { context: this.ari } : {}),
          ...(this.branchDeploy ? { branchDeploy: this.branchDeploy } : {}),
        },
      ];

      const headers = this.branchDeploy
        ? {
            'ATL-SG-SERVICE-INJECTION-URL':
              'https://object-resolver-service.us-west-1.staging.atl-paas.net',
          }
        : undefined;
      return request('post', `${this.orsBaseURL}/resolve/batch`, data, headers)
        .then((resolvedUrls: BatchResponse = []) => {
          const response = resolvedUrls[0];
          if (!isSuccessfulResponse(response)) {
            // @ts-ignore CardClient.mapErrorResponse is a private method...
            throw super.mapErrorResponse(response);
          }
          return this.handleFetchSuccess(response.body);
        })
        .catch(this.handleFetchError);
    }

    // Native fetch
    return super
      .fetchData(url, force)
      .then(this.handleFetchSuccess)
      .catch(this.handleFetchError);
  }

  private handleFetchError = (error: Error) => {
    if (this.onError) {
      this.onError(error);
    }
    return getDefaultResponse();
  };

  private handleFetchSuccess = async (response: JsonLd.Response) => {
    if (this.onResolve) {
      this.onResolve(response);
    }
    return response;
  };
}

export default JsonldEditorClient;
