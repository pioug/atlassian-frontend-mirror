import React from 'react';

import { DragHandleDisabledIcon } from '../icons/DragHandleDisabledIcon';
import { DragHandleIcon } from '../icons/DragHandleIcon';
import { MinimisedHandleIcon } from '../icons/MinimisedHandle';

type HandleIconProps = {
	forceDefaultHandle: boolean;
	isHandleHovered: boolean;
	hasMergedCells: boolean;
};

export const HandleIconComponent = (props: HandleIconProps) => {
	const { forceDefaultHandle, isHandleHovered, hasMergedCells } = props;

	if (isHandleHovered || forceDefaultHandle) {
		return hasMergedCells ? <DragHandleDisabledIcon /> : <DragHandleIcon />;
	}

	return <MinimisedHandleIcon />;
};
