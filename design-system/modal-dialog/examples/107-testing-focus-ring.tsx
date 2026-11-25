/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { token } from '@atlaskit/tokens';

/**
 * Test fixture for the modal focus ring.
 *
 * - `body-scroll` and `viewport-scroll`: nothing inside can take focus, so focus rests on the
 *   modal itself. After a keyboard open, the modal surface shows the focus ring.
 * - `with-button`: the button inside takes focus and shows its own ring.
 */
type TVariant = 'none' | 'body-scroll' | 'viewport-scroll' | 'with-button';

const styles = cssMap({
	// The resolved focus ring color and width, read by the test.
	focusRingTokens: {
		color: token('color.border.focused'),
		borderBlockStartStyle: 'solid',
		borderBlockStartWidth: token('border.width.focused'),
	},
});

const triggers: ReadonlyArray<{ variant: TVariant; label: string }> = [
	{ variant: 'body-scroll', label: 'Open modal with nothing focusable' },
	{ variant: 'viewport-scroll', label: 'Open viewport scroll modal with nothing focusable' },
	{ variant: 'with-button', label: 'Open modal with a button' },
];

export default function TestingFocusRing(): React.ReactNode {
	const [openVariant, setOpenVariant] = useState<TVariant>('none');
	const close = useCallback(() => setOpenVariant('none'), []);

	return (
		<div>
			{/* No text, so it is not part of the page content. */}
			<span css={styles.focusRingTokens} data-testid="focus-ring-tokens" />
			{triggers.map(({ variant, label }) => (
				<Button
					key={variant}
					aria-haspopup="dialog"
					onClick={() => setOpenVariant(variant)}
					testId={`${variant}-modal-trigger`}
				>
					{label}
				</Button>
			))}
			<ModalTransition>
				{openVariant === 'body-scroll' && (
					<Modal onClose={close} testId="body-scroll-modal">
						{/* eslint-disable-next-line @atlaskit/design-system/use-modal-dialog-close-button -- nothing focusable on purpose */}
						<ModalHeader>
							<ModalTitle>Nothing focusable</ModalTitle>
						</ModalHeader>
						<ModalBody>Loading</ModalBody>
					</Modal>
				)}
				{openVariant === 'viewport-scroll' && (
					<Modal onClose={close} testId="viewport-scroll-modal" shouldScrollInViewport>
						{/* eslint-disable-next-line @atlaskit/design-system/use-modal-dialog-close-button -- nothing focusable on purpose */}
						<ModalHeader>
							<ModalTitle>Viewport scroll, nothing focusable</ModalTitle>
						</ModalHeader>
						<ModalBody>Loading</ModalBody>
					</Modal>
				)}
				{openVariant === 'with-button' && (
					<Modal onClose={close} testId="with-button-modal">
						<ModalHeader>
							<ModalTitle>With a button</ModalTitle>
						</ModalHeader>
						<ModalBody>Content</ModalBody>
						<ModalFooter>
							<Button testId="with-button-modal-close" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</div>
	);
}
