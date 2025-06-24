import React from 'react';

import { Prettify } from '@atlaskit/linking-common';

import type { SmartLinkStatus } from '../../../../../constants';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context';
import type { ElementProps } from '../index';

export type CustomElementProps = Prettify<
	Pick<ElementProps, 'className' | 'testId'> & {
		content?: string;
	} & Partial<Record<SmartLinkStatus, React.ReactNode>>
>;

const CustomByStatusElement = ({
	className,
	testId = 'custom-by-status-element',
	...props
}: CustomElementProps): JSX.Element | null => {
	const context = useFlexibleCardContext();
	const status = context?.status;

	if (!status) {
		return null;
	}

	const component = props[status];
	if (!component) {
		return null;
	}

	return (
		<span
			data-separator
			data-smart-element="custom-element"
			data-smart-element-text
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			{component}
		</span>
	);
};

export default CustomByStatusElement;
