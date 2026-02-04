/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

const contentStyles = css({
	maxWidth: 220,
	backgroundColor: token('utility.elevation.surface.current'),
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const headerStyles = css({
	position: 'absolute',
	backgroundColor: token('utility.elevation.surface.current'),
	borderBlockEnd: `${token('border.width')} solid ${token('color.border')}`,
	boxShadow: token('elevation.shadow.overflow'),
	insetBlockStart: 0,
	insetInlineEnd: 0,
	insetInlineStart: 0,
	paddingBlockEnd: token('space.100', '8px'),
	paddingBlockStart: token('space.100', '8px'),
	paddingInlineEnd: token('space.100', '8px'),
	paddingInlineStart: token('space.100', '8px'),
});

const PopupSurfaceDetectionExample = (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Popup
			shouldRenderToParent
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			content={() => (
				<div css={contentStyles}>
					<div css={headerStyles}>Header overlay</div>
					<p>
						The header's background color is set to the current surface color and will overlay this
						content.
					</p>
				</div>
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
		/>
	);
};

export default PopupSurfaceDetectionExample;
