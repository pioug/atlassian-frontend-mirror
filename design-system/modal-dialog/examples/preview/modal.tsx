import React from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Modal width="small">
					<ModalHeader>
						<ModalTitle>Archive project?</ModalTitle>
					</ModalHeader>
					<ModalBody>You can restore this project later.</ModalBody>
					<ModalFooter>
						<Button>Cancel</Button>
						<Button appearance="primary">Archive</Button>
					</ModalFooter>
				</Modal>
			</Box>
		</IntlProvider>
	);
}
