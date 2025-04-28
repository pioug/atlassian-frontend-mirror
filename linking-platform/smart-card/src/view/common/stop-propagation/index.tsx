/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useCallback } from 'react';

import { css, jsx } from '@compiled/react';

const styles = css({
	maxHeight: 0,
	maxWidth: 0,
	position: 'absolute',
});

type StopPropagationProps = { children: ReactNode };

export const StopPropagation = ({ children }: StopPropagationProps) => {
	const onClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
		// Prevent click event inside modal from bubble up
		e.stopPropagation();
	}, []);

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable
		<span css={styles} onClick={onClick}>
			{children}
		</span>
	);
};
