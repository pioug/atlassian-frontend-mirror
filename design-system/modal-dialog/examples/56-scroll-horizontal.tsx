/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useCallback, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import Checkbox from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import { token } from '@atlaskit/tokens';

import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '../src';

const containerStyles = css({
	display: 'grid',
	width: '250%',
	padding: token('space.200', '16px'),
	gridTemplateColumns: 'repeat(2, 1fr)',
});

export default function ExampleScroll() {
	const [isOpen, setIsOpen] = useState(false);
	const [shouldScrollInViewport, setShouldScrollInViewPort] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const triggerRef = useRef<HTMLDivElement>(null);
	const scrollTriggerIntoView = useCallback(
		() => triggerRef.current && triggerRef.current.scrollIntoView(true),
		[],
	);

	return (
		<div css={containerStyles}>
			<div>
				<p>The width of body is greater than viewport width (horizontally scrollable).</p>

				<br />
				<Button appearance="primary" onClick={scrollTriggerIntoView} testId="scroll-into-view">
					Scroll trigger into view
				</Button>
			</div>

			<div ref={triggerRef}>
				<Field name="sb" label="Scrolling behavior">
					{() => (
						<Checkbox
							label="Should scroll within the viewport"
							name="scroll"
							testId="scroll"
							onChange={(e) => setShouldScrollInViewPort(e.target.checked)}
							isChecked={shouldScrollInViewport}
						/>
					)}
				</Field>

				<br />
				<Button onClick={open} testId="modal-trigger">
					Open modal
				</Button>
			</div>

			<ModalTransition>
				{isOpen && (
					<ModalDialog
						onClose={close}
						shouldScrollInViewport={shouldScrollInViewport}
						testId="modal"
					>
						<ModalHeader>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Lorem count={10} />
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" testId="scrollDown">
								Scroll to bottom
							</Button>
							<Button appearance="primary" onClick={close} testId="primary">
								Close
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
		</div>
	);
}
