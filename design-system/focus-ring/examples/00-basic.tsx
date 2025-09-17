/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import FocusRing from '@atlaskit/focus-ring';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const baseStyles = css({
	display: 'block',
	margin: `${token('space.150', '12px')} 0`,
	padding: token('space.100', '8px'),
	border: 'none',
	borderRadius: token('radius.small', '3px'),
	font: 'inherit',
});

const stackStyles = css({
	display: 'flex',
	maxWidth: 300,
	padding: token('space.100', '8px'),
	gap: token('space.100', '8px'),
	flexDirection: 'column',
});

export default () => {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	useEffect(() => {
		if (buttonRef.current) {
			buttonRef.current.focus();
		}
	}, []);

	return (
		<div data-testid="outerDiv" css={stackStyles}>
			<Button>AK Button</Button>
			<FocusRing>
				<button type="button" ref={buttonRef} css={baseStyles}>
					Native Button
				</button>
			</FocusRing>
			<Textfield placeholder="AK Textfield" />
			<FocusRing isInset>
				<input
					style={{
						border: `${token('border.width.selected')} solid ${token('color.border')}`,
					}}
					data-testid="input"
					css={baseStyles}
					placeholder="Native Textfield"
				/>
			</FocusRing>
		</div>
	);
};
