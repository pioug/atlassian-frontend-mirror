/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Manager, Popper, Reference } from '@atlaskit/popper';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	scroller: {
		width: '320px',
		height: '160px',
		overflow: 'auto',
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		paddingBlock: token('space.500'),
		paddingInline: token('space.500'),
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
	},
	surfaceHidden: {
		opacity: 0,
	},
	surfaceVisible: {
		opacity: 1,
	},
});

export default function FlagReferenceVisible(): React.JSX.Element {
	return (
		<div data-testid="scroller" css={styles.scroller}>
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
				<Popper placement="bottom">
					{({ ref, style, isReferenceHidden }) => (
						<div
							ref={ref}
							data-testid="popper"
							data-is-reference-hidden={isReferenceHidden}
							css={[
								styles.surface,
								isReferenceHidden ? styles.surfaceHidden : styles.surfaceVisible,
							]}
							style={style}
						>
							popover
						</div>
					)}
				</Popper>
			</Manager>
		</div>
	);
}
