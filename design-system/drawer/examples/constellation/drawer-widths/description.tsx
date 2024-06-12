import React from 'react';

import { widths } from '../../../src/constants';

const DrawerWidthsDescription = () => {
	const widthOptions = widths.length;
	return (
		<p>
			There is a selection of preset drawer sizes to choose from. Set `width` to one of the
			following:
			{widths.map((width, i) => {
				if (widthOptions === i + 1) {
					return ` ${width}`;
				} else {
					return ` ${width},`;
				}
			})}
			.
		</p>
	);
};

export default DrawerWidthsDescription;
