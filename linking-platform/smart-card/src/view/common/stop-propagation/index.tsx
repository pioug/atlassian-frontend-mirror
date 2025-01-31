/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useCallback } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { StopPropagationOld } from './StopPropagationOld';

const styles = css({
	maxHeight: 0,
	maxWidth: 0,
	position: 'absolute',
});

type StopPropagationProps = { children: ReactNode };

const StopPropagationNew = ({ children }: StopPropagationProps) => {
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

export const StopPropagation = (props: StopPropagationProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <StopPropagationNew {...props} />;
	}
	return <StopPropagationOld {...props} />;
};
