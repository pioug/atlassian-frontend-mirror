/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import { Popup } from '@atlaskit/popup/compositional/popup';
import { PopupContent } from '@atlaskit/popup/compositional/popup-content';
import { PopupTrigger } from '@atlaskit/popup/compositional/popup-trigger';

const PopupDefaultExample = (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup isOpen={isOpen} id="my-id">
			<PopupTrigger>
				{(props) => (
					<button type="button" onClick={() => setIsOpen(!isOpen)} {...props}>
						trigger
					</button>
				)}
			</PopupTrigger>
			<PopupContent onClose={() => setIsOpen(false)}>{() => <div>Hello world</div>}</PopupContent>
		</Popup>
	);
};

export default PopupDefaultExample;
