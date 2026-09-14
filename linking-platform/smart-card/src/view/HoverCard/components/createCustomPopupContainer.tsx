import React from 'react';

import type { PopupComponentProps } from '@atlaskit/popup/types';

/**
 * Factory function to create a CustomPopupContainer with a specific z-index
 */
export const createCustomPopupContainer = (
	zIndex?: number,
): React.ForwardRefExoticComponent<PopupComponentProps & React.RefAttributes<HTMLDivElement>> => {
	return React.forwardRef<HTMLDivElement, PopupComponentProps>(
		// FIXME: ...props spreads all props to the div, including isReferenceHidden, which is not a valid prop for a div.
		// Find another way but adding exceptions with _, __, ___ etc.
		({ children, shouldFitContainer: _, shouldRenderToParent: __, ...props }, ref) => (
			<div
				{...props}
				ref={ref}
				{...(zIndex !== undefined && { style: { ...props.style, zIndex } })}
			>
				{children}
			</div>
		),
	);
};
