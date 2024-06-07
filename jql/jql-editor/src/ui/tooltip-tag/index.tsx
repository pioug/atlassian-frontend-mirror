import React, { forwardRef } from 'react';

import { StyledTooltipTag } from './styled';

// We need to use a custom tag element in our tooltip to prevent extra whitespace being rendered after the element
export const TooltipTag = forwardRef<HTMLElement>((props, ref) => (
	<StyledTooltipTag ref={ref as (instance: HTMLElement | null) => void} {...props} />
));
