/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	text: {
		// content can grow and shrink
		flexGrow: 1,
		flexShrink: 1,

		// ellipsis for overflow text
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	icon: {
		display: 'flex',
		// icon size cannot grow and shrink
		flexGrow: 0,
		flexShrink: 0,
		alignSelf: 'center',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
		userSelect: 'none',
	},
	common: {
		transition: 'opacity 0.3s',
	},
	fade: {
		opacity: 0,
	},
	/**
	 * These CSS variables consumed by the new icons, to allow them to have appropriate
	 * padding inside Button while also maintaining spacing for the existing icons.
	 *
	 * These styles will be removed once platform-button-icon-spacing-cleanup feature flag
	 * is fully rolled out and cleaned up.
	 */
	beforeIcon: {
		'--ds--button--new-icon-padding-start': token('space.050'),
		'--ds--button--new-icon-padding-end': token('space.025'),
	},
	afterIcon: {
		'--ds--button--new-icon-padding-start': token('space.025'),
		'--ds--button--new-icon-padding-end': token('space.050'),
	},
});

type ContentProps = {
	children: React.ReactNode;
	type?: 'text' | 'icon';
	isLoading: boolean;
	position?: 'before' | 'after';
};

/**
 * __Content__
 *
 * Used for slots within a Button, including icons and text content.
 */
const Content = ({ children, type = 'text', isLoading, position }: ContentProps): JSX.Element => {
	return (
		<span
			css={[
				styles.common,
				type === 'text' && styles.text,
				type === 'icon' && styles.icon,
				isLoading && styles.fade,
				!fg('platform-button-icon-spacing-cleanup') && position === 'before' && styles.beforeIcon, //TODO Remove this line when platform-button-icon-spacing-cleanup is removed
				!fg('platform-button-icon-spacing-cleanup') && position === 'after' && styles.afterIcon, //TODO Remove this line when platform-button-icon-spacing-cleanup is removed
			]}
		>
			{children}
		</span>
	);
};

export default Content;
