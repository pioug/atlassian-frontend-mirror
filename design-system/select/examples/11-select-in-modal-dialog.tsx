import React, { Component } from 'react';

import Button from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import Select from '@atlaskit/select';

interface State {
	isOpen: boolean;
}

const options = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Canberra', value: 'canberra' },
	{ label: 'Darwin', value: 'darwin' },
	{ label: 'Hobart', value: 'hobart' },
	{ label: 'Melbourne', value: 'melbourne' },
	{ label: 'Perth', value: 'perth' },
	{ label: 'Sydney', value: 'sydney' },
];

// eslint-disable-next-line @repo/internal/react/no-class-components
class SelectInModal extends Component<{}, State> {
	state: State = { isOpen: false };

	open = () => this.setState({ isOpen: true });

	close = () => this.setState({ isOpen: false });

	render() {
		const { isOpen } = this.state;

		return (
			<div>
				<Button onClick={this.open}>Open Modal</Button>

				<ModalTransition>
					{isOpen && (
						<Modal onClose={this.close}>
							<ModalHeader hasCloseButton>
								<ModalTitle>Modal Title</ModalTitle>
							</ModalHeader>
							<ModalBody>
								<Label htmlFor="modal-select-example">Which city do you live in?</Label>
								<Select
									inputId="modal-select-example"
									defaultValue={options.slice(3)}
									isMulti
									options={options}
									placeholder=""
									// The below is needed for the modal dialog to not crop <Select> dropdown.
									// The z-index ensures it floats above the modal. Check out:
									// https://atlaskit.atlassian.com/examples/design-system/modal-dialog/with-layered-components
									// for more examples of modal usage with select.
									// See ticket to have these styles baked into <Select>: https://product-fabric.atlassian.net/browse/DSP-1826
									menuPortalTarget={document.body}
									// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
									styles={{
										menuPortal: (base) => ({
											...base,
											zIndex: 9999,
										}),
									}}
								/>
							</ModalBody>
							<ModalFooter>
								<Button appearance="primary" onClick={this.close}>
									Close
								</Button>
							</ModalFooter>
						</Modal>
					)}
				</ModalTransition>
			</div>
		);
	}
}

export default (): React.JSX.Element => <SelectInModal />;
