/** @jsx jsx */
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { IntlProvider } from 'react-intl-next';

import { css, jsx } from '@emotion/core';

import { EnvironmentsKeys } from '../../src/client/types';
import {
  ActionItem,
  Card,
  ElementItem,
  FooterBlock,
  loadingPlaceholderClassName,
  MetadataBlock,
  Provider,
  SmartLinkDirection,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkTheme,
  SnippetBlock,
  TitleBlock,
} from '../../src';
import TitleBlockOption from './TitleBlockOption';
import CardOption from './CardOption';
import EnvironmentOption from './EnvironmentOption';
import { exampleTokens } from '../utils/flexible-ui';
import { ExampleClient } from './ExampleClient';
import MetadataBlockOption from './MetadataBlockOption';
import SnippetBlockOption from './SnippetBlockOption';
import FooterBlockOption from './FooterBlockOption';
import PreviewBlock from '../../src/view/FlexibleCard/components/blocks/preview-block';
import PreviewBlockOption from './PreviewBlockOption';

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

  .${loadingPlaceholderClassName} {
    display: none;
  }
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

  const [titleBlockActions, setTitleBlockActions] = useState<ActionItem[]>([]);
  const [text, setText] = useState<string>('');
  // MetadataBlock options
  const [showMetadataBlock, setShowMetadataBlock] = useState<boolean>(false);
  const [metadataMaxLines, setMetadataMaxLines] = useState<number>(2);
  const [primary, setPrimary] = useState<ElementItem[]>([]);
  const [secondary, setSecondary] = useState<ElementItem[]>([]);
  // SnippetBlock options
  const [showSnippetBlock, setShowSnippetBlock] = useState<boolean>(false);
  // FooterBlock options
  const [showFooterBlock, setShowFooterBlock] = useState<boolean>(false);
  const [footerBlockActions, setFooterBlockActions] = useState<ActionItem[]>(
    [],
  );
  // Preview options
  const [showPreviewBlock, setShowPreviewBlock] = useState<boolean>(false);

  return (
    <div css={containerStyles}>
      <div css={contentStyles}>
        <ErrorBoundary fallback={<div>Whoops! Something went wrong.</div>}>
          <IntlProvider locale="en">
            <Provider client={new ExampleClient(env)}>
              <Card
                appearance="inline"
                url={url}
                ui={{ size, hideBackground, hideElevation, hidePadding, theme }}
              >
                {showPreviewBlock && <PreviewBlock />}
                <TitleBlock
                  direction={direction}
                  maxLines={maxLines}
                  position={position}
                  metadata={metadata}
                  subtitle={subtitle}
                  actions={titleBlockActions}
                  text={text}
                />
                {showMetadataBlock && (
                  <MetadataBlock
                    maxLines={metadataMaxLines}
                    primary={primary}
                    secondary={secondary}
                  />
                )}
                {showSnippetBlock && <SnippetBlock />}
                {showFooterBlock && (
                  <FooterBlock actions={footerBlockActions} />
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
          text={text}
          setDirection={setDirection}
          setMaxLines={setMaxLines}
          setMetadata={setMetadata}
          setPosition={setPosition}
          setSubTitle={setSubTitle}
          setActions={setTitleBlockActions}
          setText={setText}
        />
        <MetadataBlockOption
          primary={primary}
          secondary={secondary}
          setMaxLines={setMetadataMaxLines}
          setPrimary={setPrimary}
          setSecondary={setSecondary}
          setShow={setShowMetadataBlock}
        />
        <SnippetBlockOption setShow={setShowSnippetBlock} />
        <FooterBlockOption
          setShow={setShowFooterBlock}
          setActions={setFooterBlockActions}
        />
        <PreviewBlockOption setShow={setShowPreviewBlock} />
      </div>
    </div>
  );
};

export default FlexibleUiExample;
