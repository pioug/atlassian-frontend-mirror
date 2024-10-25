/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

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
export default CustomPopupContainer;
