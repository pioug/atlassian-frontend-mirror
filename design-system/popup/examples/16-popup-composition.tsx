/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/react';

import { Popup, PopupContent, PopupTrigger } from '../src/compositional/popup';

const PopupDefaultExample = () => {
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
