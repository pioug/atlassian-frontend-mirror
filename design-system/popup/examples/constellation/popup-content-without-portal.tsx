/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

import Popup from '../../src';

const contentStyles = xcss({
	padding: 'space.200',
});

const PopupContentWithoutPortalExample = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			content={() => <Box xcss={contentStyles}>Content</Box>}
			shouldRenderToParent
			trigger={(triggerProps) => (
				<Button
					{...triggerProps}
					appearance="primary"
					isSelected={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? 'Close' : 'Open'} popup{' '}
				</Button>
			)}
		/>
	);
};

export default PopupContentWithoutPortalExample;
