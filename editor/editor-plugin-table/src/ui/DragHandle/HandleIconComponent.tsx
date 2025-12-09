import React from 'react';

import { DragHandleDisabledIcon } from '../icons/DragHandleDisabledIcon';
import { DragHandleIcon } from '../icons/DragHandleIcon';
import { MinimisedHandleIcon } from '../icons/MinimisedHandle';

type HandleIconProps = {
	forceDefaultHandle: boolean;
	hasMergedCells: boolean;
	isHandleHovered: boolean;
};

export const HandleIconComponent = (props: HandleIconProps): React.JSX.Element => {
	const { forceDefaultHandle, isHandleHovered, hasMergedCells } = props;

	if (isHandleHovered || forceDefaultHandle) {
		return hasMergedCells ? <DragHandleDisabledIcon /> : <DragHandleIcon />;
	}

	return <MinimisedHandleIcon />;
};
