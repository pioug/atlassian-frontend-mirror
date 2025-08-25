import React from 'react';

import Button from '@atlaskit/button/standard-button';
import { type Appearance } from '@atlaskit/button/types';

export type Props = {
	appearance?: Appearance;
	'aria-haspopup'?: boolean;
	autoFocus?: boolean;
	iconBefore?: React.ReactChild;
	isDisabled?: boolean;
	isLoading?: boolean;
	isSelected?: boolean;
	onClick: (e: React.MouseEvent<HTMLElement>) => void;
	text?: React.ReactNode;
};

export const ShareButton = React.forwardRef<HTMLElement, Props>(
	// Discard aria-haspopup
	function ShareButton({ text, 'aria-haspopup': _ariaHasPopup, ...props }: Props, ref) {
		return (
			<Button id="share-trigger-btn" ref={ref} aria-haspopup="dialog" {...props}>
				{text}
			</Button>
		);
	},
);

ShareButton.displayName = 'ShareButton';

export default ShareButton;
