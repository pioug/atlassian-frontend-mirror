/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import Popup from '@atlaskit/popup';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const contentStyles = css({
	maxWidth: '220px',
	backgroundColor: token('utility.elevation.surface.current'),
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const SurfaceAwareBox = () => {
	return (
		<div css={contentStyles}>
			A surface aware box - the background color depends on the surface it's placed on.
		</div>
	);
};

const PopupSurfaceDetectionExample = (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Flex gap="space.200">
			<Popup
				shouldRenderToParent
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
