/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useCallback } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	wrapper: {
		maxHeight: '0px',
		maxWidth: '0px',
		position: 'absolute',
	},
});

type StopPropagationProps = { children: ReactNode };

/**
 * A wrapper component that prevents click events from propagating to parent elements.
 *
 * This component is commonly used within modals or overlays to prevent unintended
 * interactions with parent handlers when users interact with nested content.
 *
 */
export const StopPropagation = ({ children }: StopPropagationProps) => {
	const onClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
		// Prevent click events from bubbling up
		e.stopPropagation();
	}, []);

	return (
		<Box as="span" role="none" xcss={styles.wrapper} onClick={onClick}>
			{children}
		</Box>
	);
};
