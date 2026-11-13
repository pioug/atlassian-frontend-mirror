import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Modal from '@atlaskit/editor-extension-dropbox/modal';
import SectionMessage from '@atlaskit/section-message/message';

export default (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<>
			<SectionMessage appearance="warning">
				Internal component only - not consumable outside this package
			</SectionMessage>
			<Button onClick={() => setIsOpen(true)}>Show Modal</Button>
			<Modal
				showModal={isOpen}
				onClose={() => setIsOpen(false)}
				TEST_ONLY_src="http://localhost:9000/examples.html?groupId=editor&packageId=extension-dropbox&exampleId=bad-example-modal-content"
			/>
		</>
	);
};
