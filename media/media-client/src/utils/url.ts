const mediaBlobUrlIdentifier = 'media-blob-url';

export const isMediaBlobUrl = (url: string): boolean => {
  return url.indexOf(`${mediaBlobUrlIdentifier}=true`) > -1;
};

export interface MediaBlobUrlAttrs {
  id: string;
  contextId: string;
  collection?: string;
  size?: number;
  name?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  alt?: string;
}

const getNumberFromParams = (
  params: URLSearchParams,
  name: keyof MediaBlobUrlAttrs,
): number | undefined => {
  const value = params.get(name);

  return typeof value === 'string' && !isNaN(parseInt(value))
    ? parseInt(value)
    : undefined;
};

const getStringFromParams = (
  params: URLSearchParams,
  name: keyof MediaBlobUrlAttrs,
): string | undefined => {
  const value = params.get(name);
  if (!value) {
    return;
  }

  return decodeURIComponent(value);
};

export const getAttrsFromUrl = (
  blobUrl: string,
): MediaBlobUrlAttrs | undefined => {
  const url = new URL(blobUrl);
  const hash = url.hash.replace('#', '');
  const params = new URLSearchParams(hash);
  const id = params.get('id');
  const contextId = params.get('contextId');
  // check if we have the required params
  if (!id || !contextId) {
    return;
  }

  return {
    id,
    contextId,
    collection: getStringFromParams(params, 'collection'),
    alt: getStringFromParams(params, 'alt'),
    height: getNumberFromParams(params, 'height'),
    width: getNumberFromParams(params, 'width'),
    size: getNumberFromParams(params, 'size'),
    name: getStringFromParams(params, 'name'),
    mimeType: getStringFromParams(params, 'mimeType'),
  };
};

export const objectToQueryString = (json: {
  [key: string]: string | number | boolean | undefined | null;
}): string => {
  return Object.keys(json)
    .filter(
      (attrName) =>
        typeof json[attrName] !== 'undefined' && json[attrName] !== null,
    )
    .map((key) => {
      const value = json[key];
      if (typeof value === 'undefined' || value === null) {
        return;
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(
        value.toString(),
      )}`;
    })
    .join('&');
};

export const addFileAttrsToUrl = (
  url: string,
  fileAttrs: MediaBlobUrlAttrs,
): string => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(
    (navigator as Navigator).userAgent,
  );
  if (isSafari) {
    return url;
  }
  const mediaIdentifierAttr = {
    [mediaBlobUrlIdentifier]: 'true',
  };
  const mergedAttrs = {
    ...mediaIdentifierAttr,
    ...fileAttrs,
  };
  const queryAttrs = objectToQueryString(mergedAttrs);

  // we can't use '?' separator for blob url params
  return `${url}#${queryAttrs}`;
};
