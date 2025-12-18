/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Popup, { type PopupComponentProps } from '@atlaskit/popup';
import { token } from '@atlaskit/tokens';

const containerStyles = css({
	backgroundColor: token('color.background.neutral.bold'),
	borderRadius: token('radius.small', '3px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus': {
		outline: 'none',
	},
});

const contentStyles = css({
	width: 175,
	height: 250,
});

const CustomPopupContainer: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<PopupComponentProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, PopupComponentProps>(({ children, ...props }, ref) => (
	<div
		css={containerStyles}
		{...props}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		className={props.className}
		ref={ref}
	>
		{children}
	</div>
));

export default () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			shouldRenderToParent
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
