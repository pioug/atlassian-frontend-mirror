/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog-content';

/**
 * Test fixture for the `Dialog` outline reset. `Dialog` draws no focus ring: a wrapper draws one on
 * its surface.
 *
 * - `nothing-focusable`: no control inside, so focus rests on the `<dialog>`. It has no outline.
 * - `with-button`: the button inside takes focus and shows its own ring.
 * - `full-viewport`: like `nothing-focusable`, with the dialog as big as the viewport. The page
 *   must not scroll.
 */
type TVariant = 'none' | 'nothing-focusable' | 'with-button' | 'full-viewport';

const styles = cssMap({
	card: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
		backgroundColor: token('elevation.surface.overlay'),
	},
	fullViewport: {
		width: '100%',
		height: '100%',
	},
	button: {
		// A visible ring on the button, as a design system button has.
		'&:focus-visible': {
			outlineColor: token('color.border.focused'),
			outlineStyle: 'solid',
			outlineWidth: token('border.width.focused'),
		},
	},
});

const triggers: ReadonlyArray<{ variant: TVariant; label: string }> = [
	{ variant: 'nothing-focusable', label: 'Open dialog with nothing focusable' },
	{ variant: 'with-button', label: 'Open dialog with a button' },
	{ variant: 'full-viewport', label: 'Open full viewport dialog' },
];

export default function TestingDialogOutline(): React.ReactNode {
	const [openVariant, setOpenVariant] = useState<TVariant>('none');
	const handleClose = useCallback(() => setOpenVariant('none'), []);

	return (
		<div>
			{triggers.map(({ variant, label }) => (
				<button
					key={variant}
					type="button"
					data-testid={`${variant}-trigger`}
					onClick={() => setOpenVariant(variant)}
				>
					{label}
				</button>
			))}
			<Dialog
				isOpen={openVariant === 'nothing-focusable'}
				onClose={handleClose}
				label="Nothing focusable"
				testId="nothing-focusable-dialog"
			>
				<div css={styles.card}>Loading</div>
			</Dialog>
			<Dialog
				isOpen={openVariant === 'with-button'}
				onClose={handleClose}
				label="With a button"
				testId="with-button-dialog"
			>
				<div css={styles.card}>
					<button type="button" css={styles.button} onClick={handleClose}>
						Close
					</button>
				</div>
			</Dialog>
			<Dialog
				isOpen={openVariant === 'full-viewport'}
				onClose={handleClose}
				label="Full viewport"
				testId="full-viewport-dialog"
				xcss={styles.fullViewport}
			>
				<div css={styles.card}>Loading</div>
			</Dialog>
		</div>
	);
}
