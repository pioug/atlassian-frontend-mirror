import React from 'react';

import { ElementName, IconType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps, toBadgeProps } from '../common';

export type SubTasksProgressElementProps = BaseBadgeElementProps;

const SubTasksProgressElement = (props: SubTasksProgressElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toBadgeProps(context.subTasksProgress?.toString()) : null;

	return data ? (
		<BaseBadgeElement
			icon={IconType.SubTasksProgress}
			{...data}
			{...props}
			name={ElementName.SubTasksProgress}
		/>
	) : null;
};

export default SubTasksProgressElement;
