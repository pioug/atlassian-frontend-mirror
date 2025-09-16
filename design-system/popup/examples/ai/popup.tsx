import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import Popup from '@atlaskit/popup';

export default () => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popup
			content={() => <div>Basic popup content</div>}
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			trigger={(triggerProps) => (
				<Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
					Toggle Popup
				</Button>
			)}
			shouldRenderToParent
		/>
	);
};
