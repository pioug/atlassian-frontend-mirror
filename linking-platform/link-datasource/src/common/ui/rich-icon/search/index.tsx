import React from 'react';

import { RenderSVG, type RenderSVGProps } from '../../common/render-svg';

import Standard from './assets/standard.svg';

export const RichIconSearch = (props: RenderSVGProps) => {
	return <RenderSVG src={Standard} {...props} />;
};
