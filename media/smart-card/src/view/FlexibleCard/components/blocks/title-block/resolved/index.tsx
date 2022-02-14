import React from 'react';

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

const TitleBlockResolvedView: React.FC<TitleBlockProps> = ({
  maxLines,
  metadata = [],
  position,
  subtitle = [],
  actions = [],
  testId,
  theme,
  ...blockProps
}) => {
  const metadataElements = renderElementItems(metadata);
  const subtitleElements = renderElementItems(subtitle);
  return (
    <Block {...blockProps} testId={`${testId}-resolved-view`}>
      <LinkIcon position={position} />
      <ElementGroup
        direction={SmartLinkDirection.Vertical}
        width={SmartLinkWidth.Flexible}
      >
        <Title maxLines={maxLines} theme={theme} />
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
      {actions.length > 0 && <ActionGroup items={actions} />}
    </Block>
  );
};

export default TitleBlockResolvedView;
