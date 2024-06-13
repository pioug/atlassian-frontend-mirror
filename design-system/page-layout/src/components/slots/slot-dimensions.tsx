import React from 'react';

import { UNSAFE_media } from '@atlaskit/primitives/responsive';

interface SlotDimensionsProps {
	variableName: string;
	value?: number;
	mobileValue?: number;
}

export default ({ variableName, value, mobileValue }: SlotDimensionsProps) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766
	<style>
		{`:root{--${variableName}:${value}px;}`}
		{mobileValue && `${UNSAFE_media.below.sm} { :root{--${variableName}:${mobileValue}px;} }`}
	</style>
);
