/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Popper } from '@atlaskit/popper/main';
import { Manager } from '@atlaskit/popper/manager';
import { Reference } from '@atlaskit/popper/reference';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	scroller: {
		inlineSize: '320px',
		blockSize: '60px',
		overflow: 'auto',
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
	},
	inner: {
		blockSize: '400px',
		position: 'relative',
	},
	trigger: {
		marginBlockStart: '200px',
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
		inlineSize: '200px',
	},
});

/**
 * The anchor is clipped out of a short scroller, which is enough for the browser
 * to strongly hide an anchor-positioned popover. This consumer reports
 * `isReferenceHidden` and keeps painting, as legacy popper allowed, so the
 * surface must stay hit-testable in both gate states. Contrast
 * `04-flag-reference-hidden.tsx`, which opts into fading out instead.
 *
 * The `right` placement and 24px offset keep the surface clear of the scroller
 * and inside the viewport, so a hit-test on it means something.
 */
export default function FlagClippedAnchor(): React.JSX.Element {
	return (
		<div data-testid="scroller" css={styles.scroller}>
			<div css={styles.inner}>
				<Manager>
					<Reference>
						{({ ref }) => (
							<button
								type="button"
								ref={ref as React.Ref<HTMLButtonElement>}
								data-testid="trigger"
								css={styles.trigger}
							>
								clipped anchor
							</button>
						)}
					</Reference>
					<Popper placement="right" offset={[0, 24]}>
						{({ ref, style, isReferenceHidden }) => (
							<div
								ref={ref}
								data-testid="popper"
								data-is-reference-hidden={isReferenceHidden}
								css={styles.surface}
								style={style}
							>
								surface that stays painted
							</div>
						)}
					</Popper>
				</Manager>
			</div>
		</div>
	);
}
