/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import FocusRing from '../../src';

const buttonStyles = css({
	display: 'block',
	margin: `${token('space.150', '12px')} 0`,
	padding: token('space.100', '8px'),
	border: 'none',
	borderRadius: '3px',
});

const spacerStyles = xcss({
	padding: 'space.100',
});

export default () => {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	useEffect(() => {
		if (buttonRef.current) {
			buttonRef.current.focus();
		}
	}, []);

	return (
		<Box xcss={spacerStyles}>
			<FocusRing>
				<button type="button" ref={buttonRef} css={buttonStyles}>
					Native Button
				</button>
			</FocusRing>
		</Box>
	);
};
