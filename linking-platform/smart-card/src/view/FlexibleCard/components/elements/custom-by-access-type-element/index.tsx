import React from 'react';

import type { Prettify } from '@atlaskit/linking-common';

import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps } from '../common';

type AccessType =
	| 'DIRECT_ACCESS'
	| 'REQUEST_ACCESS'
	| 'PENDING_REQUEST_EXISTS'
	| 'FORBIDDEN'
	| 'DENIED_REQUEST_EXISTS';

export type CustomElementByAccessTypeProps = Prettify<
	Pick<BaseTextElementProps, 'className' | 'testId' | 'color'> &
		Partial<Record<AccessType | 'fallback', string>>
>;

const CustomElementByAccessType = ({
	className,
	testId = 'custom-by-access-type-element',
	...props
}: CustomElementByAccessTypeProps): JSX.Element | null => {
	const context = useFlexibleCardContext();
	const accessType = context?.data?.meta?.accessType;

	const text = props[accessType as AccessType] ?? props.fallback;
	if (!text) {
		return null;
	}

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<BaseTextElement {...props} content={text} className={className} testId={testId} hideFormat />
	);
};

export default CustomElementByAccessType;
