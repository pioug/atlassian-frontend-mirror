/** @jsx jsx */
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { IntlProvider } from 'react-intl-next';

import { css, jsx } from '@emotion/core';
import { DevPreviewWarning } from '@atlaskit/docs';

import { EnvironmentsKeys } from '../../src/client/types';
import {
  ActionItem,
  Card,
  ElementItem,
  MetadataBlock,
  Provider,
  SmartLinkDirection,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkTheme,
  TitleBlock,
} from '../../src';
import TitleBlockOption from './TitleBlockOption';
import CardOption from './CardOption';
import EnvironmentOption from './EnvironmentOption';
import { exampleTokens } from '../utils/flexible-ui';
import { ExampleClient } from './ExampleClient';
import MetadataBlockOption from './MetadataBlockOption';

const initialUrl = 'https://BitbucketRepository';

const containerStyles = css`
  background-color: ${exampleTokens.backgroundColor};
  min-height: 100%;
  padding: 1rem;
`;

const contentStyles = css`
  max-width: 680px;
  margin: 0 auto;
  padding: 1rem;
`;

const FlexibleUiExample: React.FC = () => {
  const [env, setEnv] = useState<EnvironmentsKeys>('stg');
  const [url, setUrl] = useState<string>(initialUrl);
  // Card options
  const [size, setSize] = useState<SmartLinkSize>(SmartLinkSize.Medium);
  const [theme, setTheme] = useState<SmartLinkTheme>(SmartLinkTheme.Link);
  const [hideBackground, setHideBackground] = useState<boolean>(false);
  const [hideElevation, setHideElevation] = useState<boolean>(false);
  const [hidePadding, setHidePadding] = useState<boolean>(false);
  const [direction, setDirection] = useState<SmartLinkDirection>(
    SmartLinkDirection.Horizontal,
  );
  // TitleBlock options
  const [maxLines, setMaxLines] = useState<number>(2);
  const [position, setPosition] = useState<SmartLinkPosition>(
    SmartLinkPosition.Top,
  );
  const [metadata, setMetadata] = useState<ElementItem[]>([]);
  const [subtitle, setSubTitle] = useState<ElementItem[]>([]);
  const [action, setAction] = useState<ActionItem[]>([]);
  // MetadataBlock options
  const [showMetadataBlock, setShowMetadataBlock] = useState<boolean>(false);
  const [metadataMaxLines, setMetadataMaxLines] = useState<number>(2);
  const [primary, setPrimary] = useState<ElementItem[]>([]);
  const [secondary, setSecondary] = useState<ElementItem[]>([]);

  return (
    <div css={containerStyles}>
      <DevPreviewWarning />
      <div css={contentStyles}>
        <ErrorBoundary fallback={<div>Whoops! Something went wrong.</div>}>
          <IntlProvider locale="en">
            <Provider client={new ExampleClient(env)}>
              <Card
                appearance="inline"
                url={url}
                ui={{ size, hideBackground, hideElevation, hidePadding, theme }}
              >
                <TitleBlock
                  direction={direction}
                  maxLines={maxLines}
                  position={position}
                  metadata={metadata}
                  subtitle={subtitle}
                  actions={action}
                />
                {showMetadataBlock && (
                  <MetadataBlock
                    maxLines={metadataMaxLines}
                    primary={primary}
                    secondary={secondary}
                  />
                )}
              </Card>
            </Provider>
          </IntlProvider>
        </ErrorBoundary>
        <EnvironmentOption
          env={env}
          url={url}
          setEnv={setEnv}
          setUrl={setUrl}
        />
        <CardOption
          size={size}
          theme={theme}
          setHideBackground={setHideBackground}
          setHideElevation={setHideElevation}
          setHidePadding={setHidePadding}
          setSize={setSize}
          setTheme={setTheme}
        />
        <TitleBlockOption
          metadata={metadata}
          subtitle={subtitle}
          actions={action}
          setDirection={setDirection}
          setMaxLines={setMaxLines}
          setMetadata={setMetadata}
          setPosition={setPosition}
          setSubTitle={setSubTitle}
          setAction={setAction}
        />
        <MetadataBlockOption
          primary={primary}
          secondary={secondary}
          setMaxLines={setMetadataMaxLines}
          setPrimary={setPrimary}
          setSecondary={setSecondary}
          setShow={setShowMetadataBlock}
        />
      </div>
    </div>
  );
};

export default FlexibleUiExample;