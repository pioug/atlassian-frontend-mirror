/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import MoreIcon from '@atlaskit/icon/glyph/more';
import Popup, { type PopupComponentProps } from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

const containerStyles = css({
	backgroundColor: token('color.background.neutral.bold'),
	borderRadius: token('border.radius', '3px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus': {
		outline: 'none',
	},
});
const contentStyles = css({
	width: 175,
	height: 250,
});
const CustomPopupContainer = forwardRef<HTMLDivElement, PopupComponentProps>(
	({ children, ...props }, ref) => (
		<div css={containerStyles} {...props} ref={ref}>
			{children}
		</div>
	),
);

export default () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			popupComponent={CustomPopupContainer}
			content={() => <div css={contentStyles} />}
			trigger={(triggerProps) => (
				<IconButton
					{...triggerProps}
					isSelected={isOpen}
					onClick={() => setIsOpen(!isOpen)}
					label="More"
					icon={MoreIcon}
				/>
			)}
		/>
	);
};
