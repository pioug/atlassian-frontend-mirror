/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useCallback } from 'react';

import { Appearance } from '@atlaskit/button';

import { SmartLinkSize } from '../../../../../../constants';
import { ActionProps } from '../../../actions/action/types';
import * as Actions from '../../../actions';
import { ActionItem } from '../../types';

const ActionGroupItem: React.FC<{
  item: ActionItem;
  size: SmartLinkSize;
  appearance?: Appearance;
  asDropDownItems?: boolean;
  onActionItemClick?: () => void;
}> = ({ item, size, appearance, asDropDownItems, onActionItemClick }) => {
  const { name, hideContent, hideIcon, onClick, isDisabled, ...props } = item;
  const handleOnClick = useCallback(() => {
    if (onActionItemClick) {
      onActionItemClick();
    }
    if (onClick) {
      onClick();
    }
  }, [onActionItemClick, onClick]);

  const Action = Actions[name];
  if (!Action) {
    return null;
  }

  const actionProps: Partial<ActionProps> = {
    ...props,
  };
  if (hideContent && !asDropDownItems) {
    actionProps.content = '';
  }
  if (hideIcon) {
    actionProps.icon = undefined;
  }

  return (
    <Action
      // Remove url once ViewAction is retired.
      // This seems to be a typescript workaround
      // because ViewAction marks it as required,
      // which does not reflect actual implementation as the url
      // came from data context and not all actions require url.
      // https://product-fabric.atlassian.net/browse/EDM-9547
      url=""
      asDropDownItem={asDropDownItems}
      size={size}
      appearance={appearance}
      onClick={handleOnClick}
      isDisabled={isDisabled}
      {...actionProps}
    />
  );
};
export default ActionGroupItem;
