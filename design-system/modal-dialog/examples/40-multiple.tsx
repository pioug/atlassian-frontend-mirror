import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
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

const sizes = ['large', 'medium', 'small'];

export default function NestedDemo() {
	const [shouldScrollInViewport, setShouldScrollInViewPort] = useState(false);
	const [openModals, setOpenModals] = useState<{ [key: string]: boolean }>({});

	const open = useCallback(
		(name: string) => setOpenModals((prev) => ({ ...prev, [name]: true })),
		[],
	);
	const close = useCallback(
		(name: string) => setOpenModals((prev) => ({ ...prev, [name]: false })),
		[],
	);

	const handleStackChange = (idx: number, name: string) => {
		console.info(`"${name}" stack change`, idx);
		console.log(`"${name}" stack change ${idx}`);
	};

	const handleOpenComplete = (name: string) => {
		console.info(`The enter animation of modal #${name} has completed.`);
	};

	const handleCloseComplete = (name: string) => {
		console.info(`The exit animation of the "${name}" modal has completed.`);
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ maxWidth: 400, padding: token('space.200', '16px') }}>
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

			<ButtonGroup label="Modal options">
				<Button appearance="primary" testId="large" onClick={() => open('large')}>
					Open
				</Button>
			</ButtonGroup>
			<p>
				For illustrative purposes three {'"stacked"'} modals can be opened in this demo, though ADG3
				recommends only two at any time.
			</p>
			<p>
				Check the storybook{"'"}s {'"action logger"'} (or your console) to see how you can make use
				of the <code>onStackChange</code> property.
			</p>

			{sizes.map((name, index) => {
				const nextModal = sizes[index + 1];

				return (
					<ModalTransition key={name}>
						{openModals[name] && (
							<ModalDialog
								shouldScrollInViewport={shouldScrollInViewport}
								onClose={() => close(name)}
								onCloseComplete={() => handleCloseComplete(name)}
								onOpenComplete={() => handleOpenComplete(name)}
								onStackChange={(id) => handleStackChange(id, name)}
								width={name}
								testId="modal"
							>
								<ModalHeader>
									<ModalTitle>Modal: {name}</ModalTitle>
								</ModalHeader>
								<ModalBody>
									<Lorem count={2} />
								</ModalBody>
								<ModalFooter>
									<Button appearance="subtle" onClick={() => close(name)}>
										Close
									</Button>
									{nextModal && (
										<Button appearance="primary" onClick={() => open(nextModal)}>
											Open: {nextModal}
										</Button>
									)}
								</ModalFooter>
							</ModalDialog>
						)}
					</ModalTransition>
				);
			})}
		</div>
	);
}
