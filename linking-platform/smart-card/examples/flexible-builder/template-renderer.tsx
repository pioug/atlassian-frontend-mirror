/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { useCallback, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DropdownMenu, {
  DropdownItemRadio,
  DropdownItemRadioGroup,
} from '@atlaskit/dropdown-menu';
import Button from '@atlaskit/button/standard-button';
import MoreIcon from '@atlaskit/icon/glyph/more';
import Range from '@atlaskit/range/range';
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
  position: relative;
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
  position: absolute;
  right: 0.5rem;
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
  const handleViewChange = useCallback(
    () => setShowDataView((prev) => !prev),
    [],
  );

  const showToggle = useMemo(
    () => template && template.blocks && template.blocks.length > 0,
    [template],
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
        {showToggle && (
          <span css={toggleContainerStyles}>
            <DropdownMenu
              trigger={({ triggerRef, ...props }) => (
                <Button
                  {...props}
                  iconBefore={<MoreIcon label="more" />}
                  ref={triggerRef}
                  spacing="compact"
                />
              )}
            >
              <DropdownItemRadioGroup id="renderer-actions">
                <DropdownItemRadio
                  id="card"
                  isSelected={!showDataView}
                  onClick={handleViewChange}
                >
                  Card view
                </DropdownItemRadio>
                <DropdownItemRadio
                  id="data"
                  isSelected={showDataView}
                  onClick={handleViewChange}
                >
                  Data view
                </DropdownItemRadio>
              </DropdownItemRadioGroup>
            </DropdownMenu>
          </span>
        )}
        <ErrorBoundary fallback={<div>Whoops! Something went wrong.</div>}>
          <div css={dataContainerStyles(showDataView)}>
            <FlexibleDataView url={url} />
          </div>
          <div css={cardContainerStyles(width, !showDataView)}>
            <Card
              appearance="block"
              {...template.cardProps}
              ui={template.ui}
              url={url}
            >
              {template.blocks?.map((block, idx) =>
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
