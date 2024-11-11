/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import Popup from '@atlaskit/popup';
import { Flex } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const contentStyles = css({
	maxWidth: 220,
	padding: token('space.200', '16px'),
	backgroundColor: token('utility.elevation.surface.current'),
});

const SurfaceAwareBox = () => {
	return (
		<div css={contentStyles}>
			A surface aware box - the background color depends on the surface it's placed on.
		</div>
	);
};

const PopupSurfaceDetectionExample = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Flex gap="space.200">
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement="bottom-start"
				content={SurfaceAwareBox}
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
			/>
			<SurfaceAwareBox />
		</Flex>
	);
};

export default PopupSurfaceDetectionExample;
