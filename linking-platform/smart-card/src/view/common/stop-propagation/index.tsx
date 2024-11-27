/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

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
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
		<span css={styles} onClick={onClick}>
			{children}
		</span>
	);
};
