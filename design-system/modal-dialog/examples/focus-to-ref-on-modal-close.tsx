/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useCallback, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import ModalDialog, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../src';

const containerStyles = css({
	padding: token('space.200', '16px'),
});

export default function ReturnFocusToElement() {
	const [isOpen, setIsOpen] = useState(false);
	const returnFocusRef = useRef<HTMLButtonElement>(null);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	return (
		<div data-testid="return-focus-container" css={containerStyles}>
			<Inline space="space.200">
				<Button appearance="primary" onClick={open} testId="open-modal">
					Open trigger
				</Button>
				<Button appearance="primary" ref={returnFocusRef} testId="return-focus-element">
					Focused on modal close
				</Button>
			</Inline>
			{isOpen && (
				<ModalDialog shouldReturnFocus={returnFocusRef}>
					<ModalHeader>
						<ModalTitle>Returning focus to custom element</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<p>Modal content</p>
					</ModalBody>
					<ModalFooter>
						<Button appearance="primary" onClick={close} testId="close-modal">
							Close
						</Button>
					</ModalFooter>
				</ModalDialog>
			)}
		</div>
	);
}
