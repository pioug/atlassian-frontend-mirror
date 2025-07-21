/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { type MessageDescriptor } from 'react-intl-next';

import type { Prettify } from '@atlaskit/linking-common';
import { token } from '@atlaskit/tokens';

import { InternalActionName } from '../../../../../constants';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps } from '../common';

type AccessType =
	| 'DIRECT_ACCESS'
	| 'REQUEST_ACCESS'
	| 'PENDING_REQUEST_EXISTS'
	| 'FORBIDDEN'
	| 'DENIED_REQUEST_EXISTS';

const baseStyle = css({
	color: token('color.text.subtle'),
	font: token('font.body.small'),
	whiteSpace: 'normal',
	display: '-webkit-box',
	minWidth: 0,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	wordBreak: 'break-word',
	WebkitBoxOrient: 'vertical',
});

const isMessageDescriptor = (x: MessageDescriptor | React.ReactNode): x is MessageDescriptor =>
	!React.isValidElement(x);

const fontOverrideStyleMap = cssMap({
	'font.body': {
		font: token('font.body'),
	},
	'font.body.large': {
		font: token('font.body.large'),
	},
	'font.body.small': {
		font: token('font.body.small'),
	},
	'font.body.UNSAFE_small': {
		font: token('font.body.UNSAFE_small'),
	},
});

export type CustomElementByAccessTypeProps = Prettify<
	Pick<BaseTextElementProps, 'className' | 'testId' | 'color' | 'fontSize'> &
		Partial<Record<AccessType | 'fallback', MessageDescriptor | React.ReactNode>>
>;

const maxLinesCss = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	WebkitLineClamp: 1,
	'@supports not (-webkit-line-clamp: 1)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxHeight: `calc(1 * 1rem)`,
	},
});

const CustomElementByAccessType = ({
	className,
	testId = 'custom-by-access-type-element',
	...props
}: CustomElementByAccessTypeProps): JSX.Element | null => {
	const context = useFlexibleCardContext();
	const accessType = context?.data?.meta?.accessType;

	const contentForAccessType = props[accessType as AccessType] ?? props.fallback;
	if (!contentForAccessType) {
		return null;
	}

	const values = context?.data?.actions?.[InternalActionName.UnresolvedAction]?.values;

	if (isMessageDescriptor(contentForAccessType)) {
		return (
			<BaseTextElement
				{...props}
				message={{ descriptor: contentForAccessType, values }}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
				testId={testId}
				hideFormat
			/>
		);
	}

	return (
		<span
			css={[
				baseStyle,
				props.fontSize !== undefined && fontOverrideStyleMap[props.fontSize],
				maxLinesCss,
			]}
			style={{
				color: props.color,
			}}
			data-separator
			data-smart-element-text
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
		>
			{contentForAccessType}
		</span>
	);
};

export default CustomElementByAccessType;
