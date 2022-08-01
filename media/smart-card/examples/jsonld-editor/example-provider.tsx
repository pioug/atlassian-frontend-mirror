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
  onError?: (error: Error) => void;
  onResolve?: (json: JsonLd.Response) => void;
  url?: string;
};
const ExampleProvider: React.FC<Props> = ({ children, json, onError, url }) => {
  const forceFetch = url !== undefined;
  const client = useMemo(
    () => new CustomClient('staging', json, forceFetch, onError),
    [forceFetch, json, onError],
  );
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
  const { json, onError, onResolve, url } = props;

  return (
    <ExampleProvider json={json} onError={onError} url={url}>
      <UpdateJson onResolve={onResolve} url={url} />
      <Component {...props} />
    </ExampleProvider>
  );
};

export default withExampleProvider;
