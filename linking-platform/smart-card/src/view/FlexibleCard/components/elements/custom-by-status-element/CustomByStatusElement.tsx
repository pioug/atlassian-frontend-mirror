import React from 'react';

import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context/useFlexibleCardContext';
import type { CustomElementProps } from './index';

/**
 * Public API — exported externally. Do not add props without external support intent.
 */
export const CustomByStatusElement = ({
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
