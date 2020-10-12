import React from 'react';

import { fetchJson } from '../utils/fetch';
import asDataProvider, { ResultComplete, Status } from './as-data-provider';
import { CustomLinksResponse, ProviderResults } from '../../types';

export const MANAGE_HREF =
  '/wiki/plugins/servlet/customize-application-navigator';

const fetchCustomLinks = () =>
  fetchJson<CustomLinksResponse>(`/wiki/rest/menu/latest/appswitcher`);

const RealCustomLinksProvider = asDataProvider('customLinks', fetchCustomLinks);

const emptyCustomLinks: ResultComplete<CustomLinksResponse> = {
  status: Status.COMPLETE,
  data: [],
};

export const CustomLinksProvider = ({
  disableCustomLinks,
  children,
}: {
  disableCustomLinks?: boolean;
  children: (customLinks: ProviderResults['customLinks']) => React.ReactNode;
}) => {
  if (disableCustomLinks) {
    return <React.Fragment>{children(emptyCustomLinks)}</React.Fragment>;
  }

  return <RealCustomLinksProvider>{children}</RealCustomLinksProvider>;
};
