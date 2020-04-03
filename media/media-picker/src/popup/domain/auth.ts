import { Auth, isClientBasedAuth } from '@atlaskit/media-core';

export interface ClientBasedAuthHeaders {
  readonly 'X-Client-Id': string;
  readonly Authorization: string;
}

export interface AsapBasedAuthHeaders {
  readonly 'X-Issuer': string;
  readonly Authorization: string;
}

export type AuthHeaders = ClientBasedAuthHeaders | AsapBasedAuthHeaders;

export interface ClientBasedQueryParameters {
  readonly client: string;
  readonly token: string;
}

export interface AsapBasedQueryParameters {
  readonly issuer: string;
  readonly token: string;
}

export type AuthQueryParameters =
  | ClientBasedQueryParameters
  | AsapBasedQueryParameters;

export function mapAuthToAuthHeaders(auth: Auth): AuthHeaders {
  if (isClientBasedAuth(auth)) {
    return {
      'X-Client-Id': auth.clientId,
      Authorization: `Bearer ${auth.token}`,
    };
  } else {
    return {
      'X-Issuer': auth.asapIssuer,
      Authorization: `Bearer ${auth.token}`,
    };
  }
}

export function mapAuthToQueryParameters(auth: Auth): AuthQueryParameters {
  if (isClientBasedAuth(auth)) {
    return {
      client: auth.clientId,
      token: auth.token,
    };
  } else {
    return {
      issuer: auth.asapIssuer,
      token: auth.token,
    };
  }
}
