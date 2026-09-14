import React from 'react';

import { token } from '@atlaskit/tokens';

const CustomGlyph = () => (
	<svg width="83" height="6" viewBox="0 0 83 6" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M0.428223 4.0112C0.428223 4.0112 6.35543 1.20063 10.4282 1.0112C15.2535 0.786762 17.5977 4.0112 22.4282 4.0112C27.2587 4.0112 29.5977 1.01007 34.4282 1.0112C38.8335 1.01222 41.0265 3.33342 45.4282 3.5112C50.7856 3.72757 53.5691 0.845277 58.9282 1.0112C63.5219 1.15342 65.8325 3.47137 70.4282 3.5112C75.215 3.55267 77.6415 1.04949 82.4282 1.0112"
			stroke={token('color.icon')}
			strokeWidth="2"
		/>
	</svg>
);

export const SketchStrokeIcon = (): React.JSX.Element => {
	return <CustomGlyph />;
};
