/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

import { type ActionBarWrapperProps } from './types';
import { actionsBarClassName } from './styles';

const wrapperStyles = css({
	position: 'absolute',
	transition: 'all .3s',
	top: 0,
	right: 0,
	display: 'flex',
	flexFlow: 'row nowrap',
	justifyContent: 'right',
	paddingTop: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
	gap: token('space.100', '8px'),
	opacity: 0,
});

const fixedActionBarStyle = css({
	opacity: 1,
});

export const ActionsBarWrapper = (props: ActionBarWrapperProps) => {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable
		<div
			id="actionsBarWrapper"
			data-testId="actionsBarWrapper"
			css={[wrapperStyles, props.isFixed && fixedActionBarStyle]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={actionsBarClassName}
			onClick={(event) => {
				event.stopPropagation();
				event.preventDefault();
			}}
		>
			{props.children}
		</div>
	);
};

ActionsBarWrapper.displayName = 'ActionsBarWrapper';
