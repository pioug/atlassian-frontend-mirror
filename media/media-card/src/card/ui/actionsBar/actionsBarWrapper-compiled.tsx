/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

import { type ActionBarWrapperProps } from './types';
import { actionsBarClassName } from './styles';
import { fg } from '@atlaskit/platform-feature-flags';

const wrapperStyles = css({
	position: 'absolute',
	transition: 'all .3s',
	top: 0,
	right: 0,
	display: 'flex',
	flexFlow: 'row nowrap',
	justifyContent: 'right',
	paddingTop: token('space.100'),
	paddingBottom: token('space.100'),
	paddingRight: token('space.100'),
	paddingLeft: token('space.100'),
	gap: token('space.100'),
	opacity: 0,
});

const fixedActionBarStyle = css({
	opacity: 1,
});

export const ActionsBarWrapper = (props: ActionBarWrapperProps): JSX.Element => {
	const a11yProps = fg('platform_media_a11y_suppression_fixes')
		? {
				role: 'presentation' as const,
				tabIndex: -1,
			}
		: {};
	return (
		// eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/no-static-element-interactions
		<div
			id="actionsBarWrapper"
			data-testId="actionsBarWrapper"
			{...a11yProps}
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
