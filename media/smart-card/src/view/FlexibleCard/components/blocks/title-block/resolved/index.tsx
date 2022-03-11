/** @jsx jsx */
import React, { useState } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/core';
import { LinkIcon, Title } from '../../../elements';
import { TitleBlockProps } from '../types';
import Block from '../../block';
import ElementGroup from '../../element-group';
import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkWidth,
} from '../../../../../../constants';
import { renderElementItems } from '../../utils';
import ActionGroup from '../../action-group';

const actionOnHoverOnlyStyle: SerializedStyles = css`
  .action-group-more-button {
    visibility: hidden;
  }

  &:hover {
    .action-group-more-button {
      visibility: visible;
    }
  }
`;

const TitleBlockResolvedView: React.FC<TitleBlockProps> = ({
  maxLines,
  metadata = [],
  position,
  subtitle = [],
  actions = [],
  testId,
  theme,
  onClick,
  text,
  showActionOnHover,
  ...blockProps
}) => {
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const metadataElements = renderElementItems(metadata);
  const subtitleElements = renderElementItems(subtitle);
  const overrideText = !!text ? { text } : {};

  const extraCss =
    showActionOnHover && !actionDropdownOpen
      ? actionOnHoverOnlyStyle
      : undefined;

  return (
    <Block
      {...blockProps}
      testId={`${testId}-resolved-view`}
      extraCss={extraCss}
    >
      <LinkIcon position={position} />
      <ElementGroup
        direction={SmartLinkDirection.Vertical}
        width={SmartLinkWidth.Flexible}
      >
        <Title
          maxLines={maxLines}
          theme={theme}
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

export default TitleBlockResolvedView;
