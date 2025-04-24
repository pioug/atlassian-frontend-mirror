import React from 'react';

import { RenderSVG, type RenderSVGProps } from '../../../common/render-svg';

import Dark from './assets/dark.svg';
import Light from './assets/light.svg';

export const SpotErrorOld = (props: RenderSVGProps) => {
	return <RenderSVG src={Light} srcDark={Dark} {...props} />;
};
