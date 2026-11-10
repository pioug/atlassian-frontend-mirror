import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import { UserPicker } from '../src/components/UserPicker';

/**
 * A user picker inside a modal that closes on Escape, for browser tests of Escape and focus
 * return on the top-layer path.
 */
const Example = (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Open modal</Button>
			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={() => setIsOpen(false)}>
						<ModalHeader>
							<ModalTitle>Assign</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<ExampleWrapper>
								{({ options, onInputChange }) => (
									<UserPicker
										fieldId="assignee"
										ariaLabel="Assignee"
										options={options}
										onInputChange={onInputChange}
										isMulti
									/>
								)}
							</ExampleWrapper>
						</ModalBody>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
};

export default Example;
