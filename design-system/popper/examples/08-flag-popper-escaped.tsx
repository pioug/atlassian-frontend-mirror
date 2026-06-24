/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Manager, Popper, Reference } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	clipper: {
		width: '240px',
		height: '120px',
		overflow: 'hidden',
		position: 'relative',
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
	},
	trigger: {
		// Anchor sits at the right edge so a popper placed to the right
		// renders entirely outside the clipping ancestor.
		position: 'absolute',
		insetBlockStart: '40px',
		insetInlineEnd: '8px',
		paddingBlock: token('space.050'),
		paddingInline: token('space.100'),
		backgroundColor: token('color.background.neutral'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderRadius: token('radius.small'),
	},
	surface: {
		backgroundColor: token('color.background.neutral.bold'),
		color: token('color.text.inverse'),
		paddingBlock: token('space.100'),
		paddingInline: token('space.150'),
		borderRadius: token('radius.small'),
		font: token('font.body.small'),
		// Wide so its bounding rect leaves the clipping ancestor.
		width: '240px',
	},
});

export default function FlagPopperEscaped(): React.JSX.Element {
	return (
		<div data-testid="clipper" css={styles.clipper}>
			<Manager>
				<Reference>
					{({ ref }) => (
						<button
							type="button"
							ref={ref as React.Ref<HTMLButtonElement>}
							data-testid="trigger"
							css={styles.trigger}
						>
							trigger
						</button>
					)}
				</Reference>
				<Popper placement="right">
					{({ ref, style, hasPopperEscaped }) => (
						<div
							ref={ref}
							data-testid="popper"
							data-has-popper-escaped={hasPopperEscaped}
							css={styles.surface}
							style={style}
						>
							popover positioned outside the clipping ancestor
						</div>
					)}
				</Popper>
			</Manager>
		</div>
	);
}
