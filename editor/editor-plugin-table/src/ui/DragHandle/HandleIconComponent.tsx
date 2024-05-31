import React from 'react';

import { DragHandleDisabledIcon, DragHandleIcon, MinimisedHandleIcon } from '../icons';

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
