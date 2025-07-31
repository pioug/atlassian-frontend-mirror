/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useCallback } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { Pressable } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	pressable: {
		maxHeight: '0px',
		maxWidth: '0px',
		position: 'absolute',
	},
});

type StopPropagationProps = { children: ReactNode };

export const StopPropagation = ({ children }: StopPropagationProps) => {
	const onClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
		// Prevent click event inside modal from bubble up
		e.stopPropagation();
	}, []);

	return fg('navx-1184-fix-smart-link-a11y-interactive-states') ? (
		<Pressable xcss={styles.pressable} onClick={onClick}>
			{children}
		</Pressable>
	) : (
		// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
		<span css={styles.pressable} onClick={onClick}>
			{children}
		</span>
	);
};
