/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Popup from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const wrapperStyles = cssMap({
	root: {
		display: 'grid',
		alignItems: 'center',
		gap: token('space.200'),
		gridTemplateColumns: '1fr auto',
	},
});

const contentStyles = cssMap({
	root: {
		maxWidth: '200px',
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
	},
});

const PopupDisableAutofocusExample = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Box xcss={wrapperStyles.root}>
			<Textfield placeholder="This should stay focused when the popup opens" />
			<Popup
				shouldRenderToParent
				// eslint-disable-next-line @atlassian/a11y/no-autofocus
				autoFocus={false}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => (
					<Box xcss={contentStyles.root}>
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
