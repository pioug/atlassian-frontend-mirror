import { css, SerializedStyles } from '@emotion/react';
import React, { useCallback, useMemo } from 'react';
import {
  SmartLinkAlignment,
  SmartLinkDirection,
  SmartLinkSize,
  SmartLinkWidth,
} from '../../../../../../constants';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { Provider } from '../../../elements';
import ActionGroup from '../../action-group';
import Block from '../../block';
import ElementGroup from '../../element-group';
import { filterActionItems } from '../../utils';
import type { FooterBlockProps } from '../types';

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

const FooterBlockResolvedView: React.FC<FooterBlockProps> = (props) => {
  const {
    actions,
    testId,
    onActionMenuOpenChange,
    size = SmartLinkSize.Medium,
  } = props;
  const context = useFlexibleUiContext();

  const hasActions = useMemo(
    () => filterActionItems(actions, context)?.length > 0,
    [actions, context],
  );

  const onDropdownOpenChange = useCallback(
    (isOpen) => {
      if (onActionMenuOpenChange) {
        onActionMenuOpenChange({ isOpen });
      }
    },
    [onActionMenuOpenChange],
  );

  return (
    <Block {...props} testId={`${testId}-resolved-view`}>
      <Provider testId={`${testId}-provider`} />
      {actions && hasActions ? (
        <ElementGroup
          testId="smart-element-group-actions"
          align={SmartLinkAlignment.Right}
          direction={SmartLinkDirection.Horizontal}
          overrideCss={getActionGroupStyles(size)}
          width={SmartLinkWidth.Flexible}
        >
          <ActionGroup
            onDropdownOpenChange={onDropdownOpenChange}
            items={actions}
            appearance="default"
          />
        </ElementGroup>
      ) : null}
    </Block>
  );
};

export default FooterBlockResolvedView;
