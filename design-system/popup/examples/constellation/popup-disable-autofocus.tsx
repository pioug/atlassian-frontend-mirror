/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

import Popup from '../../src';

const wrapperStyles = xcss({
	display: 'grid',
	alignItems: 'center',
	gap: 'space.200',
	gridTemplateColumns: '1fr auto',
});

const contentStyles = xcss({
	maxWidth: '200px',
	padding: 'space.200',
});

const PopupDisableAutofocusExample = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box xcss={wrapperStyles}>
			<Textfield placeholder="This should stay focused when the popup opens" />
			<Popup
				autoFocus={false}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => (
					<Box xcss={contentStyles}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquam massa ac risus
						scelerisque, in iaculis magna semper. Phasellus sagittis congue elit, non suscipit nulla
						rhoncus vitae.
					</Box>
				)}
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						appearance="primary"
						isSelected={isOpen}
						onClick={() => setIsOpen(!isOpen)}
					>
						{isOpen ? 'Close' : 'Open'} popup
					</Button>
				)}
				placement="bottom"
			/>
		</Box>
	);
};

export default PopupDisableAutofocusExample;
