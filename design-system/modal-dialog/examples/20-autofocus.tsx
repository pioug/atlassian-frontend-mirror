/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useCallback, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '../src';

const containerStyles = xcss({
	padding: 'space.200',
});

export default function ModalDemo() {
	const focusRef = useRef<HTMLInputElement>(null);
	const [isOpen, setIsOpen] = useState('');

	const openRoot = useCallback(() => setIsOpen('root'), []);
	const openAutoFocus = useCallback(() => setIsOpen('autoFocus'), []);

	const close = useCallback(() => setIsOpen(''), []);

	const modalProps = {
		onClose: close,
		testId: 'modal',
	};

	return (
		<Box xcss={containerStyles}>
			<h2>Variants</h2>
			<p>Using ModalDialog autoFocus prop, not to be confused with the HTML autofocus attribute.</p>
			<ButtonGroup label="Auto focus options">
				<Button testId="boolean-trigger" onClick={openRoot}>
					Boolean on dialog
				</Button>

				<Button testId="autofocus-trigger" onClick={openAutoFocus}>
					using autoFocus prop
				</Button>
			</ButtonGroup>

			<p>When boolean applied to the dialog, we search inside for tabbable elements.</p>
			<p>
				The autoFocus property must be a function rather the node itself so its evaluated at the
				right time and ensures a node is returned.
			</p>

			<ModalTransition>
				{isOpen === 'root' && (
					<ModalDialog {...modalProps}>
						<ModalHeader>
							<ModalTitle>Boolean on dialog</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<p>The first {'"tabbable"'} element will be focused.</p>
							<button type="button">I am focused!</button>
							<button type="button">I am NOT focused</button>
						</ModalBody>
						<ModalFooter>
							<Button appearance="primary" onClick={close}>
								Close
							</Button>
							<Button appearance="subtle">Secondary Action</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>

			<ModalTransition>
				{isOpen === 'autoFocus' && (
					<ModalDialog autoFocus={focusRef} {...modalProps}>
						<ModalHeader>
							<ModalTitle>input is automatically focused</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<p>
								Note: Usually the the first focusable element, preferably a Close button at the top
								of the dialog, should be focused initially. This test deviates only to properly test
								the autofocus prop.
							</p>
							<div>
								<label htmlFor="not">
									This textbox should not be focused
									<input id="not" type="text" value="" />
								</label>
							</div>
							<div>
								<label htmlFor="should">
									This textbox should be focused
									<input id="should" ref={focusRef} type="text" value="" />
								</label>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle">Secondary Action</Button>
							<Button onClick={close} appearance="primary">
								Close
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
		</Box>
	);
}
