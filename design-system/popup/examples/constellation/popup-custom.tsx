/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import MoreIcon from '@atlaskit/icon/glyph/more';
import Popup, { type PopupComponentProps } from '@atlaskit/popup';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const containerStyles = css({
	backgroundColor: token('color.background.brand.bold'),
	borderRadius: token('border.radius'),
	color: token('color.text.inverse'),
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const CustomPopupContainer = forwardRef<HTMLDivElement, PopupComponentProps>(
	({ children, 'data-testid': testId, xcss: _xcss, ...props }, ref) => (
		<div
			css={containerStyles}
			test-id={testId}
			{...props}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={props.className}
			ref={ref}
		>
			{children}
		</div>
	),
);

const PopupCustomExample = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			testId="popup-custom-example"
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			popupComponent={CustomPopupContainer}
			content={() => <Box>Customized popup</Box>}
			trigger={(triggerProps) => (
				<IconButton
					{...triggerProps}
					isSelected={isOpen}
					onClick={() => setIsOpen(!isOpen)}
					icon={MoreIcon}
					label="More"
				/>
			)}
		/>
	);
};

export default PopupCustomExample;
