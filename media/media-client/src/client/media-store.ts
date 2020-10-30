import {
  AsapBasedAuth,
  AuthContext,
  ClientAltBasedAuth,
  MediaApiConfig,
} from '@atlaskit/media-core';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { FILE_CACHE_MAX_AGE, MAX_RESOLUTION } from '../constants';
import { getArtifactUrl, MediaFileArtifacts } from '../models/artifacts';
import {
  MediaChunksProbe,
  MediaCollectionItemFullDetails,
  MediaCollectionItems,
  MediaFile,
  MediaUpload,
} from '../models/media';
import {
  createUrl,
  mapResponseToBlob,
  mapResponseToJson,
  mapResponseToVoid,
  request,
  RequestHeaders,
  RequestMethod,
  RequestParams,
} from '../utils/request';

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
    const response = await this.request(`/collection/${collectionName}/items`, {
      authContext: { collectionName },
      params: {
        ...defaultGetCollectionItems,
        ...params,
      },
      headers: {
        Accept: 'application/json',
      },
    });
    const {
      data: { contents, nextInclusiveStartKey },
    }: MediaStoreResponse<MediaCollectionItems> = await mapResponseToJson(
      response,
    );
    // [TODO] MS-705: remove after backend adds filter
    // This prevents showing "ghost" files in recents
    const contentsWithoutEmptyFiles = contents.filter(
      item => item.details.size && item.details.size > 0,
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

    await this.request(`/collection/${collectionName}`, {
      method: 'PUT',
      authContext: { collectionName },
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  createUpload(
    createUpTo: number = 1,
    collectionName?: string,
  ): Promise<MediaStoreResponse<MediaUpload[]>> {
    return this.request(`/upload`, {
      method: 'POST',
      authContext: { collectionName },
      params: {
        createUpTo,
      },
      headers: {
        Accept: 'application/json',
      },
    }).then(mapResponseToJson);
  }

  uploadChunk(
    etag: string,
    blob: Blob,
    collectionName?: string,
  ): Promise<void> {
    return this.request(`/chunk/${etag}`, {
      method: 'PUT',
      authContext: { collectionName },
      body: blob,
    }).then(mapResponseToVoid);
  }

  probeChunks(
    chunks: string[],
    collectionName?: string,
  ): Promise<MediaStoreResponse<MediaChunksProbe>> {
    return this.request(`/chunk/probe`, {
      method: 'POST',
      authContext: { collectionName },
      body: JSON.stringify({
        chunks,
      }),
      headers: jsonHeaders,
    }).then(mapResponseToJson);
  }

  createFileFromUpload(
    body: MediaStoreCreateFileFromUploadBody,
    params: MediaStoreCreateFileFromUploadParams = {},
  ): Promise<MediaStoreResponse<MediaFile>> {
    return this.request('/file/upload', {
      method: 'POST',
      authContext: { collectionName: params.collection },
      params,
      body: JSON.stringify(body),
      headers: jsonHeaders,
    }).then(mapResponseToJson);
  }

  touchFiles(
    body: MediaStoreTouchFileBody,
    params: MediaStoreTouchFileParams = {},
  ): Promise<MediaStoreResponse<TouchedFiles>> {
    return this.request('/upload/createWithFiles', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(body),
      authContext: { collectionName: params.collection },
    }).then(mapResponseToJson);
  }

  getFile = (
    fileId: string,
    params: MediaStoreGetFileParams = {},
  ): Promise<MediaStoreResponse<MediaFile>> => {
    return this.request(`/file/${fileId}`, {
      params,
      authContext: { collectionName: params.collection },
    }).then(mapResponseToJson);
  };

  getFileImageURL = async (
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<string> => {
    const auth = await this.config.authProvider();

    return createUrl(`${auth.baseUrl}/file/${id}/image`, {
      params: extendImageParams(params),
      auth,
    });
  };

  async getFileBinaryURL(id: string, collectionName?: string): Promise<string> {
    const auth = await this.config.authProvider({ collectionName });

    return createUrl(`${auth.baseUrl}/file/${id}/binary`, {
      params: {
        dl: true,
        collection: collectionName,
        'max-age': FILE_CACHE_MAX_AGE,
      },
      auth,
    });
  }

  getArtifactURL = async (
    artifacts: MediaFileArtifacts,
    artifactName: keyof MediaFileArtifacts,
    collectionName?: string,
  ): Promise<string> => {
    const artifactUrl = getArtifactUrl(artifacts, artifactName);
    if (!artifactUrl) {
      throw new Error(`artifact ${artifactName} not found`);
    }

    const auth = await this.config.authProvider({ collectionName });

    return createUrl(`${auth.baseUrl}${artifactUrl}`, {
      params: { collection: collectionName, 'max-age': FILE_CACHE_MAX_AGE },
      auth,
    });
  };

  getImage = async (
    id: string,
    params?: MediaStoreGetFileImageParams,
    controller?: AbortController,
    fetchMaxRes?: boolean,
  ): Promise<Blob> => {
    // TODO add checkWebpSupport() back https://product-fabric.atlassian.net/browse/MPT-584
    const isWebpSupported = false;
    let headers;
    if (isWebpSupported) {
      headers = {
        accept: 'image/webp,image/*,*/*;q=0.8',
      };
    }
    return this.request(
      `/file/${id}/image`,
      {
        headers,
        params: extendImageParams(params, fetchMaxRes),
        authContext: { collectionName: params && params.collection },
      },
      controller,
    ).then(mapResponseToBlob);
  };

  getItems = (
    ids: string[],
    collectionName?: string,
  ): Promise<MediaStoreResponse<ItemsPayload>> => {
    const descriptors = ids.map(id => ({
      type: 'file',
      id,
      collection: collectionName,
    }));

    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify({ descriptors }),
      headers: jsonHeaders,
      authContext: { collectionName },
    }).then(mapResponseToJson);
  };

  getImageMetadata = (
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<{ metadata: ImageMetadata }> => {
    return this.request(`/file/${id}/image/metadata`, {
      params,
      authContext: { collectionName: params && params.collection },
    }).then(mapResponseToJson);
  };

  appendChunksToUpload(
    uploadId: string,
    body: AppendChunksToUploadRequestBody,
    collectionName?: string,
  ): Promise<void> {
    return this.request(`/upload/${uploadId}/chunks`, {
      method: 'PUT',
      authContext: { collectionName },
      body: JSON.stringify(body),
      headers: jsonHeaders,
    }).then(mapResponseToVoid);
  }

  copyFileWithToken(
    body: MediaStoreCopyFileWithTokenBody,
    params: MediaStoreCopyFileWithTokenParams,
  ): Promise<MediaStoreResponse<MediaFile>> {
    return this.request('/file/copy/withToken', {
      method: 'POST',
      authContext: { collectionName: params.collection }, // Contains collection name to write to
      body: JSON.stringify(body), // Contains collection name to read from
      headers: jsonHeaders,
      params, // Contains collection name to write to
    }).then(mapResponseToJson);
  }

  async request(
    path: string,
    options: MediaStoreRequestOptions = {
      method: 'GET',
      authContext: {},
    },
    controller?: AbortController,
  ): Promise<Response> {
    const { authProvider } = this.config;
    const { method, authContext, params, headers, body } = options;
    const auth = await authProvider(authContext);

    const response = await request(
      `${auth.baseUrl}${path}`,
      {
        method,
        auth,
        params,
        headers,
        body,
      },
      controller,
    );

    updateMediaRegion(response.headers.get('x-media-region'));

    return response;
  }
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

export type MediaStoreRequestOptions = {
  readonly method?: RequestMethod;
  readonly authContext: AuthContext;
  readonly params?: RequestParams;
  readonly headers?: RequestHeaders;
  readonly body?: any;
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
