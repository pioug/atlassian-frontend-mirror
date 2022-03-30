/** @jsx jsx */
import React, { useState } from 'react';

import { jsx } from '@emotion/core';

import { css, SerializedStyles } from '@emotion/core';
import { TitleBlockProps } from './types';
import Block from '../block';
import { LinkIcon, Title } from '../../elements';
import ActionGroup from '../action-group';
import {
  SmartLinkAlignment,
  SmartLinkWidth,
  SmartLinkDirection,
} from '../../../../../constants';
import ElementGroup from '../element-group';
import { renderElementItems } from '../utils';

export const actionOnHoverOnlyStyle: SerializedStyles = css`
  .actions-button-group {
    visibility: hidden;
  }

  &:hover {
    .actions-button-group {
      visibility: visible;
    }
  }
`;

interface BaseTitleBlockProps {
  blockTestIdPostfix: string;
  blockIcon?: React.ReactElement;
}

export const BaseTitleBlockComponent: React.FC<
  TitleBlockProps & BaseTitleBlockProps
> = ({
  children,
  blockTestIdPostfix,
  blockIcon,
  testId,
  showActionOnHover,
  position,
  actions = [],
  text,
  maxLines,
  theme,
  onClick,
  metadata = [],
  subtitle = [],
  anchorTarget,
  ...blockProps
}) => {
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const extraCss =
    showActionOnHover && !actionDropdownOpen
      ? actionOnHoverOnlyStyle
      : undefined;

  const overrideText = !!text ? { text } : {};
  const metadataElements = renderElementItems(metadata);
  const subtitleElements = renderElementItems(subtitle);
  return (
    <Block
      {...blockProps}
      testId={`${testId}-${blockTestIdPostfix}`}
      extraCss={extraCss}
    >
      {blockIcon || <LinkIcon position={position} />}

      <ElementGroup
        direction={SmartLinkDirection.Vertical}
        width={SmartLinkWidth.Flexible}
      >
        <Title
          maxLines={maxLines}
          theme={theme}
          target={anchorTarget}
          onClick={onClick}
          {...overrideText}
        />
        {subtitleElements && (
          <ElementGroup direction={SmartLinkDirection.Horizontal}>
            {subtitleElements}
          </ElementGroup>
        )}
      </ElementGroup>

      {metadataElements && (
        <ElementGroup
          direction={SmartLinkDirection.Horizontal}
          align={SmartLinkAlignment.Right}
        >
          {metadataElements}
        </ElementGroup>
      )}

      {children}

      {actions.length > 0 && (
        <ActionGroup
          items={actions}
          visibleButtonsNum={showActionOnHover ? 1 : 2}
          onDropdownOpenChange={(isOpen) => setActionDropdownOpen(isOpen)}
        />
      )}
    </Block>
  );
};
