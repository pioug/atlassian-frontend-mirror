/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useMemo } from 'react';
import { JsonLd } from 'json-ld-types';
import { SmartCardProvider } from '@atlaskit/link-provider';
import JsonldEditorClient from './jsonld-editor-client';
import { CardType, useSmartCardState } from '../../src/state/store';
import { SmartLinkStatus } from '../../src/constants';

const isResolvedOrErrored = (status: CardType) => {
  switch (status) {
    case SmartLinkStatus.Errored:
    case SmartLinkStatus.Fallback:
    case SmartLinkStatus.Forbidden:
    case SmartLinkStatus.NotFound:
    case SmartLinkStatus.Resolved:
    case SmartLinkStatus.Unauthorized:
      return true;
    default:
      return false;
  }
};

type Props = {
  json?: JsonLd.Response;
  onError?: (error: Error) => void;
  onResolve?: (json: JsonLd.Response) => void;
  url?: string;
};
const JsonldEditorProvider: React.FC<Props> = ({
  children,
  json,
  onError,
  url,
}) => {
  const forceFetch = url !== undefined;
  const client = useMemo(
    () => new JsonldEditorClient('staging', json, forceFetch, onError),
    [forceFetch, json, onError],
  );
  return <SmartCardProvider client={client}>{children}</SmartCardProvider>;
};

// This is a hack to update response to jsonld editor.
const JsonUpdater: React.FC<{
  onResolve?: (json: JsonLd.Response) => void;
  url?: string;
}> = ({ onResolve, url }) => {
  const cardState = useSmartCardState(url || '');
  if (onResolve && isResolvedOrErrored(cardState.status) && cardState.details) {
    onResolve(cardState.details);
  }
  return null;
};

const withJsonldEditorProvider = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P & Props> => (props) => {
  const { json, onError, onResolve, url } = props;

  return (
    <JsonldEditorProvider json={json} onError={onError} url={url}>
      <JsonUpdater onResolve={onResolve} url={url} />
      <Component {...props} />
    </JsonldEditorProvider>
  );
};

export default withJsonldEditorProvider;
