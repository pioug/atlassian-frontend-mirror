import React from 'react';
import { css } from '@emotion/react';
import { LinkIcon } from '../../../elements';
import { TitleBlockViewProps } from '../types';
import Block from '../../block';
import ElementGroup from '../../element-group';
import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkPosition,
  SmartLinkWidth,
} from '../../../../../../constants';
import { renderElementItems } from '../../utils';

/**
 * This renders a fully resolved TitleBlock.
 * This should render when a Smart Link returns a valid response.
 * @see TitleBlock
 */
const TitleBlockResolvedView: React.FC<TitleBlockViewProps> = ({
  actionGroup,
  metadata = [],
  position,
  subtitle = [],
  testId,
  text,
  title,
  metadataPosition,
  hideIcon = false,
  ...blockProps
}) => {
  const metadataElements = renderElementItems(metadata);
  const subtitleElements = renderElementItems(subtitle);
  return (
    <Block {...blockProps} testId={`${testId}-resolved-view`}>
      {!hideIcon && <LinkIcon position={position} />}
      <ElementGroup
        direction={SmartLinkDirection.Vertical}
        width={SmartLinkWidth.Flexible}
        overrideCss={css`
          gap: 0.25rem;
        `}
      >
        {title}
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
          position={metadataPosition ?? SmartLinkPosition.Center}
        >
          {metadataElements}
        </ElementGroup>
      )}
      {actionGroup}
    </Block>
  );
};

export default TitleBlockResolvedView;
