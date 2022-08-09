import { JsonLd } from 'json-ld-types';
import { unicornResponse } from '../content/example-responses';
import { extractUrlFromLinkJsonLd } from '@atlaskit/linking-common';

const defaultUrl = 'https://atlaskit.atlassian.com/packages/media/smart-card';

export const getDefaultResponse = (): JsonLd.Response =>
  unicornResponse as JsonLd.Response;

export const getDefaultUrl = (): string => {
  const response = getDefaultResponse();
  const data = response?.data as JsonLd.Data.BaseData;
  const url = extractUrlFromLinkJsonLd(data?.url || defaultUrl);
  return url || defaultUrl;
};
