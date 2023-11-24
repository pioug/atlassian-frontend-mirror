import { getTraceId } from '@atlaskit/linking-common/utils';

const getUrlPath = (url: string) => {
  try {
    return new URL(url).pathname;
  } catch {
    return 'Failed to parse pathname from url';
  }
};

export const getNetworkFields = (error: unknown) => {
  if (error instanceof Response) {
    return {
      traceId: getTraceId(error),
      status: error.status,
      path: getUrlPath(error.url),
    };
  }

  return { traceId: null, status: null, path: null };
};

export const getErrorType = (error: unknown) => {
  if (error instanceof Response) {
    return 'NetworkError';
  }
  if (error instanceof Error) {
    return error.name;
  }
  return typeof error;
};
