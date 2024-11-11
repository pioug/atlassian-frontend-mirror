/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import Popup from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

const contentStyles = css({
	maxWidth: 220,
	padding: token('space.200', '16px'),
	backgroundColor: token('utility.elevation.surface.current'),
});

const headerStyles = css({
	padding: token('space.100', '8px'),
	position: 'absolute',
	backgroundColor: token('utility.elevation.surface.current'),
	borderBlockEnd: `1px solid ${token('color.border')}`,
	boxShadow: token('elevation.shadow.overflow'),
	insetBlockStart: 0,
	insetInlineEnd: 0,
	insetInlineStart: 0,
});

const PopupSurfaceDetectionExample = () => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Popup
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
