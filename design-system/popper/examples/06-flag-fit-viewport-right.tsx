/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Manager, Popper, Reference } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingBlock: token('space.150'),
		paddingInline: token('space.150'),
		display: 'flex',
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
		paddingBlock: token('space.100'),
		paddingInline: token('space.150'),
		borderRadius: token('radius.small'),
		font: token('font.body.small'),
		// Intrinsically wide so only the per-placement cap stops it
		// running off the right edge.
		width: '9999px',
		whiteSpace: 'normal',
	},
});

export default function FlagFitViewportRight(): React.JSX.Element {
	return (
		<div css={styles.root}>
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
				<Popper placement="right" shouldFitViewport>
					{({ ref, style }) => (
						// The copy is intentionally long: when the per-placement cap clamps the
						// popover it reflows across several lines, so the fitted layout is multiple
						// lines tall. A regression that lets the oversized element overflow instead
						// of reflowing collapses it to a single (clipped) line, which the VR baseline
						// then catches as a height change.
						<div ref={ref} data-testid="popper" css={styles.surface} style={style}>
							This popover sets an explicit width that is far wider than the viewport. With
							shouldFitViewport enabled, the per-placement cap clamps it to the space available to
							the right of the trigger and the text reflows across as many lines as it needs to fit.
							Without fitting to the viewport a popover this wide would run off the right edge of
							the screen, so the content keeps wrapping neatly beside the trigger instead of being
							cut off.
						</div>
					)}
				</Popper>
			</Manager>
		</div>
	);
}
