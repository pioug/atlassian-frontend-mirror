import { MediaViewerError } from '../../errors';
import { RequestError, createRequestErrorReason } from '@atlaskit/media-client';

// Declares the type of the returned error by PDFjs.
interface ErrorWithStatus extends Error {
  status: number;
}

const isErrorWithStatus = (error: unknown): error is ErrorWithStatus =>
  error instanceof Error &&
  `status` in error &&
  typeof error.status === 'number';

export const processError = (error: unknown): MediaViewerError => {
  if (isErrorWithStatus(error)) {
    const reason = createRequestErrorReason(error.status);
    return new MediaViewerError(
      'docviewer-fetch-pdf',
      new RequestError(reason, { statusCode: error.status }),
    );
  }

  return new MediaViewerError(
    'docviewer-fetch-pdf',
    // TODO: sanitize the error message or remove it entirely
    // https://product-fabric.atlassian.net/browse/MEX-2456
    error instanceof Error ? error : undefined,
  );
};
