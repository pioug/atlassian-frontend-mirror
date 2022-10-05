/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Range from '@atlaskit/range/range';
import Toggle from '@atlaskit/toggle';
import Tooltip from '@atlaskit/tooltip';
import { Card } from '../../src';
import { BlockTemplate, FlexibleTemplate } from './types';
import { token } from '@atlaskit/tokens';
import * as Blocks from '../../src/view/FlexibleCard/components/blocks';
import withJsonldEditorProvider from '../jsonld-editor/jsonld-editor-provider';
import FlexibleDataView from '../utils/flexible-data-view';

const backColor = token('color.background.neutral.subtle', '#FFFFFF');
const frontColor = token(
  'color.background.neutral.subtle.hovered',
  '#091E420F',
);
const backgroundStyles = css`
  background-color: ${backColor};
  opacity: 1;
  background-image: repeating-linear-gradient(
      45deg,
      ${frontColor} 25%,
      transparent 25%,
      transparent 75%,
      ${frontColor} 75%,
      ${frontColor}
    ),
    repeating-linear-gradient(
      45deg,
      ${frontColor} 25%,
      ${backColor} 25%,
      ${backColor} 75%,
      ${frontColor} 75%,
      ${frontColor}
    );
  background-position: 0 0, 6px 6px;
  background-size: 12px 12px;
  border-radius: 0.125rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const toggleStyles = (show: boolean) => css`
  opacity: ${show ? 1 : 0};
  display: ${show ? 'block' : 'none'};
`;

const cardContainerStyles = (width: number, show: boolean = true) => css`
  margin: 0 auto;
  min-width: 10rem;
  width: ${width}%;
  ${toggleStyles(show)}
`;

const dataContainerStyles = (show: boolean) => css`
  margin: 0 auto;
  min-width: 25rem;
  width: 60%;
  ${toggleStyles(show)}
`;

const toggleContainerStyles = css`
  text-align: right;
`;

const renderBlock = ({ name, ...props }: BlockTemplate, key: string) => {
  const Block = Blocks[name];
  return Block ? <Block key={key} {...props} /> : null;
};

const TemplateRenderer: React.FC<{
  template: FlexibleTemplate;
  url?: string;
}> = ({ template, url }) => {
  const [width, setWidth] = useState(60);
  const handleOnChange = useCallback((width) => setWidth(width), []);

  const [showDataView, setShowDataView] = useState(false);
  const handleOnToggle = useCallback(
    () => setShowDataView((prev) => !prev),
    [],
  );

  return (
    <React.Fragment>
      <Range
        max={100}
        min={20}
        step={1}
        value={width}
        onChange={handleOnChange}
      />
      <div css={backgroundStyles}>
        <div css={toggleContainerStyles}>
          <Tooltip
            content={
              showDataView ? 'Hide link data view' : 'Show link data view'
            }
          >
            <Toggle
              label="Toggle link data view"
              defaultChecked
              onChange={handleOnToggle}
            />
          </Tooltip>
        </div>
        <ErrorBoundary fallback={<div>Whoops! Something went wrong.</div>}>
          <div css={dataContainerStyles(showDataView)}>
            <FlexibleDataView url={url} />
          </div>
          <div css={cardContainerStyles(width, !showDataView)}>
            <Card appearance="block" ui={template.ui} url={url}>
              {template.blocks.map((block, idx) =>
                renderBlock(block, block.name + idx),
              )}
            </Card>
          </div>
        </ErrorBoundary>
      </div>
    </React.Fragment>
  );
};

export default withJsonldEditorProvider(TemplateRenderer);
