import React from 'react';
import { css, SerializedStyles } from '@emotion/react';
import { Provider } from '../../../../FlexibleCard/components/elements';
import ElementGroup from '../../../../FlexibleCard/components/blocks/element-group';
import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkWidth,
} from '../../../../../constants';
import ActionGroup from '../../../../FlexibleCard/components/blocks/action-group';
import { FooterBlockProps } from '../../../../FlexibleCard/components/blocks/footer-block/types';

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

const providerStyles = css`
  span:first-child {
    margin-right: 0.375rem;
  }
`;

/**
 * This Components is a footer that is used in a Block Card with Flexible UI.
 * It contains a provider icon if provider is present and an actions list if one is passed.
 * To be shown as a part of Flexible UI, needs to be wrapped inside of a CustomBlock
 *
 * @see CustomBlock
 * @param props are the data required for the block, such as actions to be displayed.
 */
const BlockCardFooter: React.FC<FooterBlockProps> = (
  props: FooterBlockProps,
) => {
  const {
    actions,
    size = SmartLinkSize.Medium,
    testId = 'smart-block-card-footer',
  } = props;

  return (
    <>
      <Provider testId={`${testId}-provider`} overrideCss={providerStyles} />
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
    </>
  );
};

export default BlockCardFooter;
