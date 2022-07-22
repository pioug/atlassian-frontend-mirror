/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useMemo } from 'react';
import { JsonLd } from 'json-ld-types';
import { SmartCardProvider } from '@atlaskit/link-provider';
import CustomClient from './custom-client';
import { useSmartCardState } from '../../src/state/store';
import { isResolvedOrErrored } from './utils';

type Props = {
  json?: JsonLd.Response;
  onResolve?: (json: JsonLd.Response) => void;
  url?: string;
};
const ExampleProvider: React.FC<Props> = ({ children, json, url }) => {
  const forceFetch = url !== undefined;
  const client = useMemo(() => new CustomClient('staging', json, forceFetch), [
    forceFetch,
    json,
  ]);
  return <SmartCardProvider client={client}>{children}</SmartCardProvider>;
};

// This is a hack to update response to jsonld editor.
const UpdateJson: React.FC<{
  onResolve?: (json: JsonLd.Response) => void;
  url?: string;
}> = ({ onResolve, url }) => {
  const cardState = useSmartCardState(url || '');
  if (onResolve && isResolvedOrErrored(cardState.status) && cardState.details) {
    onResolve(cardState.details);
  }
  return null;
};

const withExampleProvider = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P & Props> => (props) => {
  const { json, onResolve, url } = props;

  return (
    <ExampleProvider json={json} url={url}>
      <UpdateJson onResolve={onResolve} url={url} />
      <Component {...props} />
    </ExampleProvider>
  );
};

export default withExampleProvider;
