/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import Button from '@atlaskit/button/new';
import { css, jsx } from '@atlaskit/css';
import FocusRing from '@atlaskit/focus-ring/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const baseStyles = css({
  display: 'block',
  padding: token('space.100', '8px'),
  border: 'none',
  borderRadius: token('border.radius.100', '3px'),
  font: token('font.body'),
  marginBlock: token('space.150'),
  marginInline: 0
});

const stackStyles = css({
	display: 'flex',
	maxWidth: '18.75rem',
	padding: token('space.100'),
	gap: token('space.100'),
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
			<FocusRing focus="on">
				<button type="button" ref={buttonRef} css={baseStyles}>
					Native Button (Controlled)
				</button>
			</FocusRing>
			<FocusRing focus="on" isInset>
				<button type="button" ref={buttonRef} css={baseStyles}>
					Native Button (Controlled + Inset)
				</button>
			</FocusRing>
			<Textfield placeholder="AK Textfield (No focus ring)" />
			<FocusRing isInset>
				<input
					style={{
						border: `2px solid ${token('color.border')}`,
					}}
					data-testid="input"
					css={baseStyles}
					placeholder="Native Textfield (Inset)"
				/>
			</FocusRing>
		</div>
	);
};
