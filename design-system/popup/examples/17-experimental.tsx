import React, { useState } from 'react';

import { Popup } from '@atlaskit/popup/compositional/popup';
import { PopupContent } from '@atlaskit/popup/compositional/popup-content';
import { PopupTrigger } from '@atlaskit/popup/compositional/popup-trigger';

export default (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup id="id" isOpen={isOpen}>
			<PopupTrigger>
				{(props) => (
					<button type="button" {...props} onClick={() => setIsOpen((open) => !open)}>
						Has ID
					</button>
				)}
			</PopupTrigger>
			<PopupContent>{() => <div>Hello world</div>}</PopupContent>
		</Popup>
	);
};
