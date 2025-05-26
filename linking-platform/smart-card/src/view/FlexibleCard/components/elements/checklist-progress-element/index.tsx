import React from 'react';

import { ElementName, IconType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps, toBadgeProps } from '../common';

export type ChecklistProgressElementProps = BaseBadgeElementProps;

const ChecklistProgressElement = (props: ChecklistProgressElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toBadgeProps(context.checklistProgress?.toString()) : null;

	return data ? (
		<BaseBadgeElement
			icon={IconType.CheckItem}
			{...data}
			{...props}
			name={ElementName.ChecklistProgress}
		/>
	) : null;
};

export default ChecklistProgressElement;
