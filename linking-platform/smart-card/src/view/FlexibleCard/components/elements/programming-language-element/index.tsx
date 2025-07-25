import React from 'react';

import { ElementName, IconType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps, toBadgeProps } from '../common';

export type ProgrammingLanguageElementProps = BaseBadgeElementProps;

const ProgrammingLanguageElement = (props: ProgrammingLanguageElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toBadgeProps(context.programmingLanguage) : null;

	return data ? (
		<BaseBadgeElement
			icon={IconType.ProgrammingLanguage}
			{...data}
			{...props}
			name={ElementName.ProgrammingLanguage}
		/>
	) : null;
};

export default ProgrammingLanguageElement;
