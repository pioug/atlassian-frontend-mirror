import React from 'react';

import { type PopupComponentProps } from '@atlaskit/popup';

/**
 * The purpose of this component is to hide the default Popup border.
 * HoverCard border implementation is in ContentContainer where it can
 * change between the default border and prism border during runtime.
 */
const CustomPopupContainer = React.forwardRef<HTMLDivElement, PopupComponentProps>(
	({ children, shouldFitContainer: _, shouldRenderToParent: __, ...props }, ref) => (
		<div {...props} ref={ref}>
			{children}
		</div>
	),
);

/**
 * Factory function to create a CustomPopupContainer with a specific z-index
 */
export const createCustomPopupContainer = (zIndex?: number) => {
	return React.forwardRef<HTMLDivElement, PopupComponentProps>(
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

export default CustomPopupContainer;
