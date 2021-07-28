import {
  AsapBasedAuth,
  AuthContext,
  ClientAltBasedAuth,
  MediaApiConfig,
  Auth,
} from '@atlaskit/media-core';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { FILE_CACHE_MAX_AGE, MAX_RESOLUTION } from '../../constants';
import { getArtifactUrl, MediaFileArtifacts } from '../../models/artifacts';
import {
  MediaChunksProbe,
  MediaCollectionItemFullDetails,
  MediaCollectionItems,
  MediaFile,
  MediaUpload,
} from '../../models/media';
import { request } from '../../utils/request';
import {
  createUrl,
  createMapResponseToJson,
  createMapResponseToBlob,
} from '../../utils/request/helpers';
import {
  ClientOptions,
  RequestHeaders,
  RequestMethod,
  RequestParams,
  RequestMetadata,
  CreateUrlOptions,
} from '../../utils/request/types';
import { resolveAuth, resolveInitialAuth } from './resolveAuth';

export type { MediaStoreErrorReason, MediaStoreErrorAttributes } from './error';
export { MediaStoreError, isMediaStoreError } from './error';

const defaultImageOptions: MediaStoreGetFileImageParams = {
  'max-age': FILE_CACHE_MAX_AGE,
  allowAnimated: true,
  mode: 'crop',
};

const defaultGetCollectionItems: MediaStoreGetCollectionItemsParams = {
  limit: 30,
  sortDirection: 'desc',
};

const extendImageParams = (
  params?: MediaStoreGetFileImageParams,
  fetchMaxRes: boolean = false,
): MediaStoreGetFileImageParams => {
  return {
    ...defaultImageOptions,
    ...params,
    ...(fetchMaxRes ? { width: MAX_RESOLUTION, height: MAX_RESOLUTION } : {}),
  };
};

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export class MediaStore {
  constructor(
    private readonly config: MediaApiConfig,
    readonly featureFlags?: MediaFeatureFlags,
  ) {}

  async getCollectionItems(
    collectionName: string,
    params?: MediaStoreGetCollectionItemsParams,
  ): Promise<MediaStoreResponse<MediaCollectionItems>> {
    const metadata: RequestMetadata = {
      method: 'GET',
      endpoint: '/collection/{collectionName}/items',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName },
      params: {
        ...defaultGetCollectionItems,
        ...params,
      },
      headers: {
        Accept: 'application/json',
      },
    };

    const response = await this.request(
      `/collection/${collectionName}/items`,
      options,
    );

    const {
      data: { contents, nextInclusiveStartKey },
    }: MediaStoreResponse<MediaCollectionItems> = await createMapResponseToJson(
      metadata,
    )(response);

    // [TODO] MS-705: remove after backend adds filter
    // This prevents showing "ghost" files in recents
    const contentsWithoutEmptyFiles = contents.filter(
      (item) => item.details.size && item.details.size > 0,
    );

    return {
      data: {
        contents: contentsWithoutEmptyFiles,
        nextInclusiveStartKey,
      },
    };
  }

  async removeCollectionFile(
    id: string,
    collectionName: string,
    occurrenceKey?: string,
  ): Promise<void> {
    const metadata: RequestMetadata = {
      method: 'PUT',
      endpoint: '/collection/{collectionName}',
    };

    const body = {
      actions: [
        {
          action: 'remove',
          item: {
            type: 'file',
            id,
            occurrenceKey,
          },
        },
      ],
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    await this.request(`/collection/${collectionName}`, options);
  }

  createUpload(
    createUpTo: number = 1,
    collectionName?: string,
  ): Promise<MediaStoreResponse<MediaUpload[]>> {
    const metadata: RequestMetadata = {
      method: 'POST',
      endpoint: '/upload',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName },
      params: {
        createUpTo,
      },
      headers: {
        Accept: 'application/json',
      },
    };

    return this.request(`/upload`, options).then(
      createMapResponseToJson(metadata),
    );
  }

  async uploadChunk(
    etag: string,
    blob: Blob,
    collectionName?: string,
  ): Promise<void> {
    const metadata: RequestMetadata = {
      method: 'PUT',
      endpoint: '/chunk/{etag}',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName },
      body: blob,
    };

    await this.request(`/chunk/${etag}`, options);
  }

  probeChunks(
    chunks: string[],
    collectionName?: string,
  ): Promise<MediaStoreResponse<MediaChunksProbe>> {
    const metadata: RequestMetadata = {
      method: 'POST',
      endpoint: '/chunk/probe',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName },
      headers: jsonHeaders,
      body: JSON.stringify({
        chunks,
      }),
    };

    return this.request(`/chunk/probe`, options).then(
      createMapResponseToJson(metadata),
    );
  }

  createFileFromUpload(
    body: MediaStoreCreateFileFromUploadBody,
    params: MediaStoreCreateFileFromUploadParams = {},
  ): Promise<MediaStoreResponse<MediaFile>> {
    const metadata: RequestMetadata = {
      method: 'POST',
      endpoint: '/file/upload',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName: params.collection },
      params,
      headers: jsonHeaders,
      body: JSON.stringify(body),
    };

    return this.request('/file/upload', options).then(
      createMapResponseToJson(metadata),
    );
  }

  touchFiles(
    body: MediaStoreTouchFileBody,
    params: MediaStoreTouchFileParams = {},
  ): Promise<MediaStoreResponse<TouchedFiles>> {
    const metadata: RequestMetadata = {
      method: 'POST',
      endpoint: '/upload/createWithFiles',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName: params.collection },
      headers: jsonHeaders,
      body: JSON.stringify(body),
    };

    return this.request('/upload/createWithFiles', options).then(
      createMapResponseToJson(metadata),
    );
  }

  getFile(
    fileId: string,
    params: MediaStoreGetFileParams = {},
  ): Promise<MediaStoreResponse<MediaFile>> {
    const metadata: RequestMetadata = {
      method: 'GET',
      endpoint: '/file/{fileId}',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName: params.collection },
      params,
    };

    return this.request(`/file/${fileId}`, options).then(
      createMapResponseToJson(metadata),
    );
  }

  async getFileImageURL(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<string> {
    const { collection: collectionName } = params || {};
    const auth = await this.resolveAuth({ collectionName });
    return this.createFileImageURL(id, auth, params);
  }

  getFileImageURLSync(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): string {
    const auth = this.resolveInitialAuth();
    return this.createFileImageURL(id, auth, params);
  }

  private createFileImageURL(
    id: string,
    auth: Auth,
    params?: MediaStoreGetFileImageParams,
  ): string {
    const options: CreateUrlOptions = {
      params: extendImageParams(params),
      auth,
    };
    return createUrl(`${auth.baseUrl}/file/${id}/image`, options);
  }

  async getFileBinaryURL(id: string, collectionName?: string): Promise<string> {
    const auth = await this.resolveAuth({ collectionName });

    const options: CreateUrlOptions = {
      params: {
        dl: true,
        collection: collectionName,
        'max-age': FILE_CACHE_MAX_AGE,
      },
      auth,
    };

    return createUrl(`${auth.baseUrl}/file/${id}/binary`, options);
  }

  async getArtifactURL(
    artifacts: MediaFileArtifacts,
    artifactName: keyof MediaFileArtifacts,
    collectionName?: string,
  ): Promise<string> {
    const artifactUrl = getArtifactUrl(artifacts, artifactName);
    if (!artifactUrl) {
      throw new Error(`artifact ${artifactName} not found`);
    }

    const auth = await this.resolveAuth({ collectionName });

    const options: CreateUrlOptions = {
      params: { collection: collectionName, 'max-age': FILE_CACHE_MAX_AGE },
      auth,
    };

    return createUrl(`${auth.baseUrl}${artifactUrl}`, options);
  }

  async getImage(
    id: string,
    params?: MediaStoreGetFileImageParams,
    controller?: AbortController,
    fetchMaxRes?: boolean,
  ): Promise<Blob> {
    // TODO add checkWebpSupport() back https://product-fabric.atlassian.net/browse/MPT-584
    const isWebpSupported = false;
    let headers;
    if (isWebpSupported) {
      headers = {
        accept: 'image/webp,image/*,*/*;q=0.8',
      };
    }

    const metadata: RequestMetadata = {
      method: 'GET',
      endpoint: '/file/{fileId}/image',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName: params && params.collection },
      params: extendImageParams(params, fetchMaxRes),
      headers,
    };

    return this.request(`/file/${id}/image`, options, controller).then(
      createMapResponseToBlob(metadata),
    );
  }

  async getItems(
    ids: string[],
    collectionName?: string,
  ): Promise<MediaStoreResponse<ItemsPayload>> {
    const descriptors = ids.map((id) => ({
      type: 'file',
      id,
      collection: collectionName,
    }));

    const metadata: RequestMetadata = {
      method: 'POST',
      endpoint: '/items',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName },
      headers: jsonHeaders,
      body: JSON.stringify({ descriptors }),
    };

    return this.request('/items', options).then(
      createMapResponseToJson(metadata),
    );
  }

  async getImageMetadata(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<{ metadata: ImageMetadata }> {
    const metadata: RequestMetadata = {
      method: 'GET',
      endpoint: '/file/{fileId}/image/metadata',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName: params && params.collection },
      params,
    };

    return this.request(`/file/${id}/image/metadata`, options).then(
      createMapResponseToJson(metadata),
    );
  }

  async appendChunksToUpload(
    uploadId: string,
    body: AppendChunksToUploadRequestBody,
    collectionName?: string,
  ): Promise<void> {
    const metadata: RequestMetadata = {
      method: 'PUT',
      endpoint: '/upload/{uploadId}/chunks',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName },
      headers: jsonHeaders,
      body: JSON.stringify(body),
    };

    await this.request(`/upload/${uploadId}/chunks`, options);
  }

  copyFileWithToken(
    body: MediaStoreCopyFileWithTokenBody,
    params: MediaStoreCopyFileWithTokenParams,
  ): Promise<MediaStoreResponse<MediaFile>> {
    const metadata: RequestMetadata = {
      method: 'POST',
      endpoint: '/file/copy/withToken',
    };

    const options: MediaStoreRequestOptions = {
      ...metadata,
      authContext: { collectionName: params.collection }, // Contains collection name to write to
      params, // Contains collection name to write to
      headers: jsonHeaders,
      body: JSON.stringify(body), // Contains collection name to read from
    };

    return this.request('/file/copy/withToken', options).then(
      createMapResponseToJson(metadata),
    );
  }

  async request(
    path: string,
    options: MediaStoreRequestOptions = {
      method: 'GET',
      endpoint: undefined,
      authContext: {},
    },
    controller?: AbortController,
  ): Promise<Response> {
    const {
      method,
      endpoint,
      authContext,
      params,
      headers,
      body,
      clientOptions,
    } = options;
    const auth = await this.resolveAuth(authContext);
    const response = await request(
      `${auth.baseUrl}${path}`,
      {
        method,
        endpoint,
        auth,
        params,
        headers,
        body,
        clientOptions,
      },
      controller,
    );

    updateMediaRegion(response.headers.get('x-media-region'));

    return response;
  }

  resolveAuth = (authContext?: AuthContext) =>
    resolveAuth(this.config.authProvider, authContext);

  resolveInitialAuth = () => resolveInitialAuth(this.config.initialAuth);
}

function updateMediaRegion(region: string | null) {
  if (!region || !(window && window.sessionStorage)) {
    return;
  }

  const currentRegion = window.sessionStorage.getItem('media-api-region');

  if (currentRegion !== region) {
    window.sessionStorage.setItem('media-api-region', region);
  }
}

export interface ResponseFileItem {
  id: string;
  type: 'file';
  details: MediaCollectionItemFullDetails;
  collection?: string;
}

export interface ItemsPayload {
  items: ResponseFileItem[];
}

export type ImageMetadataArtifact = {
  url?: string;
  width?: number;
  height?: number;
  size?: number;
};

export interface ImageMetadata {
  pending: boolean;
  preview?: ImageMetadataArtifact;
  original?: ImageMetadataArtifact;
}

export interface MediaStoreResponse<Data> {
  readonly data: Data;
}

export type MediaStoreRequestOptions = RequestMetadata & {
  readonly method?: RequestMethod;
  readonly authContext?: AuthContext;
  readonly params?: RequestParams;
  readonly headers?: RequestHeaders;
  readonly body?: any;
  readonly clientOptions?: ClientOptions;
};

export type MediaStoreCreateFileFromUploadParams = {
  readonly collection?: string;
  readonly occurrenceKey?: string;
  readonly expireAfter?: number;
  readonly replaceFileId?: string;
  readonly skipConversions?: boolean;
};

export type MediaStoreCreateFileParams = {
  readonly occurrenceKey?: string;
  readonly collection?: string;
};

export interface MediaStoreTouchFileParams {
  readonly collection?: string;
}

export interface TouchFileDescriptor {
  fileId: string;
  collection?: string;
  occurrenceKey?: string;
  expireAfter?: number;
  deletable?: boolean;
}

export interface MediaStoreTouchFileBody {
  descriptors: TouchFileDescriptor[];
}

export type MediaStoreCreateFileFromBinaryParams = {
  readonly replaceFileId?: string;
  readonly collection?: string;
  readonly occurrenceKey?: string;
  readonly expireAfter?: number;
  readonly skipConversions?: boolean;
  readonly name?: string;
};

export type MediaStoreCreateFileFromUploadConditions = {
  readonly hash: string;
  readonly size: number;
};

export type MediaStoreCreateFileFromUploadBody = {
  readonly uploadId: string;

  readonly name?: string;
  readonly mimeType?: string;
  readonly conditions?: MediaStoreCreateFileFromUploadConditions;
};

export type MediaStoreGetFileParams = {
  readonly version?: number;
  readonly collection?: string;
};

export type MediaStoreGetFileImageParams = {
  readonly allowAnimated?: boolean;
  readonly version?: number;
  readonly collection?: string;
  readonly width?: number;
  readonly height?: number;
  readonly mode?: 'fit' | 'full-fit' | 'crop';
  readonly upscale?: boolean;
  readonly 'max-age'?: number;
};

export type MediaStoreGetCollectionItemsParams = {
  readonly limit?: number;
  readonly inclusiveStartKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
  readonly details?: 'minimal' | 'full';
};

export interface SourceFile {
  id: string;
  owner: ClientAltBasedAuth | AsapBasedAuth; // Auth information of source file copy from
  collection?: string;
  version?: number;
}

export type MediaStoreCopyFileWithTokenBody = {
  sourceFile: SourceFile;
};

export type MediaStoreCopyFileWithTokenParams = {
  // Name of the collection to insert the file to.
  readonly collection?: string;
  // the versioned file ID that this file will overwrite. Destination fileId.
  readonly replaceFileId?: string;
  // The file will be added to the specified collection with this occurrence key.
  readonly occurrenceKey?: string;
};

export type AppendChunksToUploadRequestBody = {
  readonly chunks: string[];

  readonly hash?: string;
  readonly offset?: number;
};

export interface CreatedTouchedFile {
  fileId: string;
  uploadId: string;
}

export type TouchedFiles = {
  created: CreatedTouchedFile[];
};

export interface EmptyFile {
  readonly id: string;
  readonly createdAt: number;
}
