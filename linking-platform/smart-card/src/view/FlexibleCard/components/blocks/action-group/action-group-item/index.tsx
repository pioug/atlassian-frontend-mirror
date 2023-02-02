/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useCallback } from 'react';

import { Appearance } from '@atlaskit/button';

import { SmartLinkSize } from '../../../../../../constants';
import { ActionProps } from '../../../actions/action/types';
import * as Actions from '../../../actions';
import { ActionItem } from '../../types';
import { isJSXElementNull } from '../../utils';

const ActionGroupItem: React.FC<{
  item: ActionItem;
  size: SmartLinkSize;
  appearance?: Appearance;
  asDropDownItems?: boolean;
  onActionItemClick?: () => void;
}> = ({ item, size, appearance, asDropDownItems, onActionItemClick }) => {
  const { name, hideContent, hideIcon, onClick, ...props } = item;
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

  const action = (
    <Action
      url=""
      asDropDownItem={asDropDownItems}
      size={size}
      appearance={appearance}
      onClick={handleOnClick}
      {...actionProps}
    />
  );

  if (!isJSXElementNull(action)) {
    return action;
  }
  return null;
};
export default ActionGroupItem;
