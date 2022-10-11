import React from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { FooterBlockProps } from './types';
import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkStatus,
  SmartLinkWidth,
} from '../../../../../constants';
import Block from '../block';
import ElementGroup from '../element-group';
import { Provider } from '../../elements';
import ActionGroup from '../action-group';

const getActionGroupStyles = (
  size: SmartLinkSize,
): SerializedStyles | undefined => {
  if (size === SmartLinkSize.XLarge) {
    // The biggest height of the action button exceeds the max line-height
    // of the elements causing the action on the block with x-large size to
    // get cut at the bottom.
    return css`
      max-height: 2rem;
    `;
  }
};

/**
 * Represents a FooterBlock, designed to contain elements and actions that should appear
 * at the bottom of a link card.
 * @public
 * @param {FooterBlockProps} FooterBlockProps
 * @see Block
 */
const FooterBlock: React.FC<FooterBlockProps> = (props) => {
  const {
    status,
    actions,
    size = SmartLinkSize.Medium,
    testId = 'smart-footer-block',
  } = props;

  if (status !== SmartLinkStatus.Resolved) {
    return null;
  }

  return (
    <Block {...props} testId={`${testId}-resolved-view`}>
      <Provider testId={`${testId}-provider`} />
      {actions && actions.length > 0 ? (
        <ElementGroup
          testId="smart-element-group-actions"
          align={SmartLinkAlignment.Right}
          direction={SmartLinkDirection.Horizontal}
          overrideCss={getActionGroupStyles(size)}
          width={SmartLinkWidth.Flexible}
        >
          <ActionGroup items={actions} appearance="default" />
        </ElementGroup>
      ) : null}
    </Block>
  );
};

export default FooterBlock;
