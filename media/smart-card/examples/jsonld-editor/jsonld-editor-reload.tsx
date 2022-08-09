import React, { useEffect } from 'react';
import { JsonLd } from 'json-ld-types';
import { extractUrlFromLinkJsonLd } from '@atlaskit/linking-common';
import { useSmartLinkReload } from '../../src/hooks';
import { getDefaultUrl } from './utils';

const analytics = () => {};
const defaultUrl = getDefaultUrl();

const withJsonldEditorReload = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<
  P & {
    json?: JsonLd.Response<JsonLd.Data.BaseData>;
    url?: string;
  }
> => (props) => {
  const { json, url: forceUrl } = props;

  const data = json?.data as JsonLd.Data.BaseData;
  const url =
    forceUrl || extractUrlFromLinkJsonLd(data?.url || defaultUrl) || defaultUrl;
  const reload = useSmartLinkReload({ url, analyticsHandler: analytics });

  useEffect(() => reload(), [reload, json]);

  return <Component {...props} url={url} />;
};

export default withJsonldEditorReload;
