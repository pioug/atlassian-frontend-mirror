import React, { useCallback } from 'react';

import { type Appearance } from '@atlaskit/button';

import { type SmartLinkSize } from '../../../../../../constants';
import * as Actions from '../../../actions';
import { type ActionProps } from '../../../actions/action/types';
import { type ActionItem } from '../../types';

const ActionGroupItem = ({
	item,
	size,
	appearance,
	asDropDownItems,
	onActionItemClick,
}: {
	item: ActionItem;
	size: SmartLinkSize;
	appearance?: Appearance;
	asDropDownItems?: boolean;
	onActionItemClick?: () => void;
}) => {
	const { name, hideContent, hideIcon, onClick, isDisabled, ...props } = item;
	const handleOnClick = useCallback(() => {
		if (onActionItemClick) {
			onActionItemClick();
		}
		if (onClick) {
			onClick();
		}
	}, [onActionItemClick, onClick]);

	const Action = name in Actions ? Actions[name as keyof typeof Actions] : undefined;

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

	if (item?.entryPointWrapper) {
		actionProps.wrapper = item.entryPointWrapper;
	}

	return (
		<Action
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
