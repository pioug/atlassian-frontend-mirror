/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useCallback, useMemo } from 'react';
import { Card } from '../../src';
import withJsonldEditorProvider from './jsonld-editor-provider';
import FlexibleDataView from '../utils/flexible-data-view';
import { ErrorBoundary } from 'react-error-boundary';

const CardExample: React.FC<{
  isEmbedSupported?: boolean;
  url?: string;
}> = ({ isEmbedSupported = false, url }) => {
  const fallback = useMemo(() => <span>😭Something went wrong.</span>, []);
  const onError = useCallback((err) => console.error(err.message), []);

  return (
    <div>
      <h6>Inline</h6>
      <br />
      <div>
        Bowsprit scallywag weigh anchor Davy Jones' Locker warp ballast scurvy
        nipper brigantine Jolly Roger wench sloop Shiver me timbers rope's end
        chandler. Admiral of the Black cackle fruit deck{' '}
        <ErrorBoundary fallback={fallback} onError={onError}>
          <Card appearance="inline" url={url} showHoverPreview={true} />
        </ErrorBoundary>{' '}
        wench bounty rope's end bilge water scourge of the seven seas hardtack
        come about execution dock Nelsons folly handsomely rigging splice the
        main brace.
      </div>
      <h6>Block</h6>
      <br />
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Card appearance="block" url={url} />
      </ErrorBoundary>
      <h6>Embed</h6>
      <br />
      {isEmbedSupported ? (
        <ErrorBoundary fallback={fallback} onError={onError}>
          <Card appearance="embed" platform="web" url={url} />
        </ErrorBoundary>
      ) : (
        <div>
          <i>Whoops! This link does not support embed view.</i>
        </div>
      )}

      <h6>
        Flexible (
        <a href="https://atlaskit.atlassian.com/packages/media/smart-card/docs/flexible">
          go/flexible-smart-links-docs
        </a>
        )
      </h6>
      <br />
      <FlexibleDataView url={url} />
    </div>
  );
};

// Not the most elegant implementation but this will do.
export default withJsonldEditorProvider(CardExample);
