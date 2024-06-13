/** @jsx jsx */
import React from 'react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { type PopupComponentProps } from '@atlaskit/popup';
import { popupContainerStyles } from '../styled';
import { jsx } from '@emotion/react';

/**
 * The purpose of this component is to hide the default Popup border.
 * HoverCard border implementation is in ContentContainer where it can
 * change between the default border and prism border during runtime.
 */
const CustomPopupContainer = React.forwardRef<HTMLDivElement, PopupComponentProps>(
	({ children, ...props }, ref) => (
		<div
			css={
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				getBooleanFF('platform.linking-platform.smart-card.hover-card-ai-summaries')
					? undefined
					: // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						popupContainerStyles
			}
			{...props}
			ref={ref}
		>
			{children}
		</div>
	),
);
export default CustomPopupContainer;
