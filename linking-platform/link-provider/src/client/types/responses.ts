import { JsonLd } from 'json-ld-types';
import { ServerErrorType } from '@atlaskit/linking-common';
export type BatchResponse = Array<SuccessResponse | ErrorResponse>;

export type SuccessResponse = {
  status: number;
  body: JsonLd.Response;
};

export interface ErrorResponse {
  status: number;
  error: ErrorResponseBody;
}

export interface ErrorResponseBody {
  type: ServerErrorType;
  message: string;
  status: number;
}

export const isSuccessfulResponse = (
  response?: SuccessResponse | ErrorResponse,
): response is SuccessResponse => {
  if (!response) {
    return false;
  }

  const hasSuccessfulStatus = response.status === 200;
  const hasSuccessBody = 'body' in response;
  return hasSuccessfulStatus && hasSuccessBody;
};

export const isErrorResponse = (
  response: SuccessResponse | ErrorResponse,
): response is ErrorResponse => {
  if (!response) {
    return false;
  }

  const hasStatus = response.status >= 200;
  const hasErrorBody = 'error' in response;
  return hasStatus && hasErrorBody;
};
