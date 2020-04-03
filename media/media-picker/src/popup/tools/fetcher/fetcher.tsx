import * as url from 'url';
import { FileDetails } from '@atlaskit/media-client';
import { Auth } from '@atlaskit/media-core';
import {
  AuthHeaders,
  Service,
  ServiceAccountWithType,
  ServiceFolder,
  ServiceFolderItem,
  ServiceName,
} from '../../domain';

import { mapAuthToAuthHeaders } from '../../domain/auth';

const giphyApiKey = 'lBOxhhz1BM62Y3JsK0iQv1pRYyOGUjR8';
const toJson = (response: Response) => response.json();
type Method = 'GET' | 'POST' | 'DELETE';

export interface GiphyImage {
  url: string;
  width: string;
  height: string;
  size: string;
  mp4: string;
  mp4_size: string;
  webp: string;
  webp_size: string;
}

export interface GiphyResponse {
  data: [
    {
      id: string;
      slug: string;
      images: { fixed_width: GiphyImage; original: GiphyImage };
    },
  ];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

export interface GiphyData {
  cardModels: ImageCardModel[];
  totalResultCount: number;
}

export interface ImageCardModel {
  metadata: FileDetails;
  dataURI: string;
  dimensions: { width: number; height: number };
}

export interface Fetcher {
  fetchCloudAccountFolder(
    auth: Auth,
    serviceName: ServiceName,
    accountId: string,
    folderId: string,
    cursor?: string,
  ): Promise<ServiceFolder>;
  getServiceList(auth: Auth): Promise<ServiceAccountWithType[]>;
  unlinkCloudAccount(auth: Auth, accountId: string): Promise<void>;
  fetchTrendingGifs(offset?: number): Promise<GiphyData>;
  fetchGifsRelevantToSearch(query: string, offset?: number): Promise<GiphyData>;
}

export class MediaApiFetcher implements Fetcher {
  constructor() {}

  fetchCloudAccountFolder(
    auth: Auth,
    serviceName: ServiceName,
    accountId: string,
    folderId: string,
    cursor?: string,
  ): Promise<ServiceFolder> {
    return this.query(
      `${pickerUrl(auth.baseUrl)}/service/${serviceName}/${accountId}/folder`,
      'GET',
      {
        folderId,
        limit: 100,
        cursor,
      },
      mapAuthToAuthHeaders(auth),
    )
      .then(toJson)
      .then(({ data: serviceFolder }) => {
        if (serviceName === 'dropbox') {
          return {
            ...serviceFolder,
            items: this.sortDropboxFiles(serviceFolder.items),
          };
        } else {
          return serviceFolder;
        }
      });
  }

  getServiceList(auth: Auth): Promise<ServiceAccountWithType[]> {
    return this.query(
      `${pickerUrl(auth.baseUrl)}/accounts`,
      'GET',
      {},
      mapAuthToAuthHeaders(auth),
    )
      .then(toJson)
      .then(({ data: services }) => flattenAccounts(services));
  }

  unlinkCloudAccount(auth: Auth, accountId: string): Promise<void> {
    return this.query(
      `${pickerUrl(auth.baseUrl)}/account/${accountId}`,
      'DELETE',
      {},
      mapAuthToAuthHeaders(auth),
    ).then(() => {});
  }

  stringifyParams(queryParams: {
    [key: string]: string | undefined | number;
  }): string {
    const keys = Object.keys(queryParams);
    if (!keys.length) {
      return '';
    }

    const stringifiedParams = keys
      .map(key => {
        const value = queryParams[key];
        return value !== undefined ? `${key}=${value}` : undefined;
      })
      .filter(key => !!key)
      .join('&');

    return `?${stringifiedParams}`;
  }

  fetchTrendingGifs = (offset?: number): Promise<GiphyData> => {
    const baseUrl = 'https://api.giphy.com/v1/gifs/trending';
    const params = {
      api_key: giphyApiKey,
      rating: 'pg',
      offset,
    };
    const url = `${baseUrl}${this.stringifyParams(params)}`;

    return fetch(url)
      .then(toJson)
      .then(this.mapGiphyResponseToViewModel);
  };

  fetchGifsRelevantToSearch = (
    query: string,
    offset?: number,
  ): Promise<GiphyData> => {
    const baseUrl = 'https://api.giphy.com/v1/gifs/search';
    const params = {
      api_key: giphyApiKey,
      rating: 'pg',
      q: query,
      offset,
    };
    const url = `${baseUrl}${this.stringifyParams(params)}`;

    return fetch(url)
      .then(toJson)
      .then(this.mapGiphyResponseToViewModel);
  };

  private mapGiphyResponseToViewModel = (
    response: GiphyResponse,
  ): GiphyData => {
    const { data, pagination } = response;

    const cardModels = data.map(gif => {
      const { id, slug } = gif;
      const { size, url, width, height } = gif.images.fixed_width;

      const name = slug.replace(new RegExp(`-${id}`), '');
      const metadata: FileDetails = {
        id,
        name,
        mediaType: 'image',
        size: parseInt(size, 10),
      };

      return {
        metadata,
        dataURI: url,
        dimensions: {
          width: parseInt(width, 10),
          height: parseInt(height, 10),
        },
      };
    });

    return {
      cardModels,
      totalResultCount: pagination.total_count,
    };
  };

  private query(
    baseUrl: string,
    method: Method,
    payload: any,
    authHeaders: AuthHeaders,
  ): Promise<Response> {
    const contentType = 'application/json; charset=utf-8';
    const headers = new Headers({
      ...authHeaders,
      'Content-Type': contentType,
    });
    const params = method === 'GET' ? this.stringifyParams(payload) : '';
    const body = method !== 'GET' ? JSON.stringify(payload) : undefined;
    const url = `${baseUrl}${params}`;
    const request = new Request(url, {
      method,
      headers,
      body,
    });

    return fetch(request);
  }

  private isFolder(item: ServiceFolderItem): boolean {
    return item.mimeType === 'application/vnd.atlassian.mediapicker.folder';
  }

  private sortDropboxFiles(items: ServiceFolderItem[]): ServiceFolderItem[] {
    return items.sort((a, b) => {
      const isAFolder = this.isFolder(a);
      const isBFolder = this.isFolder(b);

      if (!isAFolder && isBFolder) {
        return 1;
      }
      if (isAFolder && !isBFolder) {
        return -1;
      }

      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      if (aName > bName) {
        return 1;
      } else if (aName < bName) {
        return -1;
      } else {
        return 0;
      }
    });
  }
}

export const fileStoreUrl = (baseUrl: string): string => {
  const { protocol, host } = url.parse(baseUrl);
  return `${protocol}//${host}`;
};

export const pickerUrl = (baseUrl: string): string => {
  return `${fileStoreUrl(baseUrl)}/picker`;
};

export function flattenAccounts(services: Service[]): ServiceAccountWithType[] {
  return services.reduce(
    (accounts, service) =>
      accounts.concat(
        service.accounts.map(account => ({
          ...account,
          type: service.type,
        })),
      ),
    new Array<ServiceAccountWithType>(),
  );
}
