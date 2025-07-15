import React from 'react';

import { type MessageDescriptor } from 'react-intl-next';

import type { Prettify } from '@atlaskit/linking-common';

import { InternalActionName } from '../../../../../constants';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps } from '../common';

type AccessType =
	| 'DIRECT_ACCESS'
	| 'REQUEST_ACCESS'
	| 'PENDING_REQUEST_EXISTS'
	| 'FORBIDDEN'
	| 'DENIED_REQUEST_EXISTS';

export type CustomElementByAccessTypeProps = Prettify<
	Pick<BaseTextElementProps, 'className' | 'testId' | 'color' | 'fontSize'> &
		Partial<Record<AccessType | 'fallback', MessageDescriptor>>
>;

const CustomElementByAccessType = ({
	className,
	testId = 'custom-by-access-type-element',
	...props
}: CustomElementByAccessTypeProps): JSX.Element | null => {
	const context = useFlexibleCardContext();
	const accessType = context?.data?.meta?.accessType;

	const descriptor = props[accessType as AccessType] ?? props.fallback;
	if (!descriptor) {
		return null;
	}

	const values = context?.data?.actions?.[InternalActionName.UnresolvedAction]?.values;

	return (
		<BaseTextElement
			{...props}
			message={{ descriptor, values }}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			testId={testId}
			hideFormat
		/>
	);
};

export default CustomElementByAccessType;
