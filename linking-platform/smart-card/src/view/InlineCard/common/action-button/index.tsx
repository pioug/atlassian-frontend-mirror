import React, { type ComponentPropsWithRef, forwardRef } from 'react';

import { Box, xcss } from '@atlaskit/primitives';

type ActionButtonProps = ComponentPropsWithRef<typeof Box> & {
	disabled?: boolean;
	[`data-testid`]?: string;
};

/**
 * Action button has to be a span for the overflow to work correctly
 */
export const ActionButton = forwardRef(
	({ children, ...props }: ActionButtonProps, ref: ActionButtonProps['ref']) => {
		// `Button transforms `testId` into `data-testid`. We need to transform it back to `testId`
		const { [`data-testid`]: testId } = props;

		return (
			<Box
				as="span"
				ref={ref}
				xcss={[actionButtonStyle, !props.disabled && actionButtonNotDisabledStyle]}
				{...props}
				aria-disabled={props.disabled}
				role="button"
				testId={testId}
			>
				<Box as="span" xcss={internalButtonStyle}>
					{children}
				</Box>
			</Box>
		);
	},
);

const actionButtonStyle = xcss({
	textAlign: 'initial',
	display: 'inline',
	borderRadius: 'border.radius.100',
	borderTopLeftRadius: '0px',
	borderBottomLeftRadius: '0px',
	backgroundClip: 'padding-box',
	boxDecorationBreak: 'clone',
	paddingLeft: 'space.075',
	paddingTop: 'space.025',
	paddingBottom: 'space.025',
	paddingRight: 'space.075',
	whiteSpace: 'nowrap',
	backgroundColor: 'color.background.neutral',
	cursor: 'not-allowed',
	color: 'color.text.disabled',
});

const internalButtonStyle = xcss({
	fontWeight: 'font.weight.medium',
});

const actionButtonNotDisabledStyle = xcss({
	color: 'color.text',
	cursor: 'pointer',
	':hover': {
		backgroundColor: 'color.background.neutral.hovered',
	},
});
