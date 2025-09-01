/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useCallback } from 'react';

import { cssMap, jsx } from '@compiled/react';

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

	return (
		<Pressable xcss={styles.pressable} onClick={onClick}>
			{children}
		</Pressable>
	);
};
