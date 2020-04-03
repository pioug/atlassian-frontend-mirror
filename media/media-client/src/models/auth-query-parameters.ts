import { Auth, isClientBasedAuth } from '@atlaskit/media-core';

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
