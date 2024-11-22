import React, { useState } from 'react';

import { Popup, PopupContent, PopupTrigger } from '@atlaskit/popup/experimental';

export default () => {
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
