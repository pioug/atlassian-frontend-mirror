import React from 'react';

import { TableCssClassName as ClassName } from '../../types';

export const MinimisedHandleIcon = (): React.JSX.Element => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="5" fill="none">
		<rect
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={ClassName.DRAG_HANDLE_MINIMISED}
			width="24"
			height="5"
			rx="3"
		/>
	</svg>
);
