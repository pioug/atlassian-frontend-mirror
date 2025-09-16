/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React from 'react';

import { token } from '@atlaskit/tokens';

export default () => (
	<div
		style={{
			backgroundColor: token('elevation.surface'),
			border: `${token('border.width')} solid ${token('color.border.brand')}`,
			color: token('color.text'),
			font: token('font.body'),
			padding: token('space.100'),
			margin: token('space.050'),
		}}
	/>
);
