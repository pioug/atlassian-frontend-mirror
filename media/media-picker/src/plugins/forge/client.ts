import {
  ForgeInvokeParams,
  ForgeProvidersResponse,
  ForgeInvokePayload,
  ServerError,
} from './types';
import { JsonLd } from 'json-ld-types';

const NON_TENANT_API_ENDPOINT =
  'https://api-private.stg.atlassian.com/object-resolver';
const TENANT_HOST_REGEX = [
  /^https:\/\/([^\.]*\.)*atl-paas\.net/,
  /^https:\/\/([^\.]*\.)*atlassian\.net/,
  /^https:\/\/([^\.]*\.)*jira-dev\.com/,
  /^https:\/\/([^\.]*\.)*jira\.com/,
  /^https:\/\/bitbucket\.org/,
];

const isServerError = (response: any): response is ServerError => {
  return !!response.message;
};

export class ForgeClient {
  getApiEndpoint() {
    for (const regex of TENANT_HOST_REGEX) {
      if (regex.test(window.location.origin)) {
        return `${window.location.origin}/gateway/api/object-resolver`;
      }
    }
    return NON_TENANT_API_ENDPOINT;
  }

  public async invokeProvider(
    extensionKey: string,
    params: ForgeInvokeParams,
  ): Promise<JsonLd.Collection> {
    const { query = '', folderId } = params;
    const context = folderId ? { id: folderId } : undefined;
    const request: ForgeInvokePayload = {
      key: extensionKey,
      search: {
        query,
        context,
      },
    };
    const response = await this.fetch<JsonLd.Collection>(
      'invoke/search',
      request,
    );

    return response;
  }

  getProviders = async (): Promise<ForgeProvidersResponse> => {
    const response = await this.fetch<ForgeProvidersResponse>('providers', {
      type: 'search',
    });

    return response;
  };

  private fetch = async <T>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(`${this.getApiEndpoint()}/${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error((await response.text()) || response.statusText);
    }

    const payload: T | ServerError = await response.json();

    if (isServerError(payload)) {
      throw new Error(payload.message);
    }

    return payload;
  };
}
