/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Manager, Popper, Reference } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

/**
 * FF-on DOM-escape example. The popper is rendered inside a
 * narrow `overflow:hidden` clipping ancestor. The migration must
 * mount the popover surface in the top layer (DOM parent is the
 * `[popover="manual"]` host on `<body>`-level), not inside the
 * clipping ancestor.
 */
const styles = cssMap({
	clipper: {
		inlineSize: '160px',
		blockSize: '120px',
		overflow: 'hidden',
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
	},
	trigger: {
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
		paddingBlock: token('space.075'),
		paddingInline: token('space.150'),
		borderRadius: token('radius.small'),
		font: token('font.body.small'),
		width: '240px',
	},
});

export default function FlagTopLayerEscape(): React.JSX.Element {
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
					{({ ref, style }) => (
						<div ref={ref} data-testid="popper" css={styles.surface} style={style}>
							popover rendered in the top layer
						</div>
					)}
				</Popper>
			</Manager>
		</div>
	);
}
