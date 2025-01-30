import React, { type ComponentPropsWithRef, forwardRef } from 'react';

import { Box, xcss } from '@atlaskit/primitives';

type ActionButtonProps = ComponentPropsWithRef<typeof Box> & {
	disabled?: boolean;
};

/**
 * Action button has to be a span for the overflow to work correctly
 */
export const ActionButton = forwardRef(
	({ children, ...props }: ActionButtonProps, ref: ActionButtonProps['ref']) => {
		return (
			<Box
				as="span"
				ref={ref}
				xcss={[actionButtonStyle, !props.disabled && actionButtonNotDisabledStyle]}
				{...props}
				aria-disabled={props.disabled}
				role="button"
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
	font: 'font.body.large',
	paddingTop: 'space.025',
	paddingLeft: 'space.075',
	paddingBottom: 'space.025',
	paddingRight: 'space.075',
	whiteSpace: 'nowrap',
	backgroundColor: 'color.background.neutral',
	cursor: 'not-allowed',
	color: 'color.text.disabled',
});

const internalButtonStyle = xcss({
	font: 'font.body',
});

const actionButtonNotDisabledStyle = xcss({
	color: 'color.text',
	cursor: 'pointer',
	':hover': {
		backgroundColor: 'color.background.neutral.hovered',
	},
});
