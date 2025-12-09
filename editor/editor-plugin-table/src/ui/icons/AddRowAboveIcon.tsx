import React from 'react';

import { token } from '@atlaskit/tokens';

export const AddRowAboveIcon = (): React.JSX.Element => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect
			width="24"
			height="24"
			fill={token('color.border.inverse', '#FFFFFF')}
			fillOpacity="0.01"
		/>
		<rect x="6" y="12" width="12" height="3" rx="0.5" fill="currentColor" />
		<rect x="6" y="16" width="12" height="3" rx="0.5" fill="currentColor" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M13 7V5.99C12.9974 5.72652 12.8908 5.47473 12.7036 5.28935C12.5163 5.10397 12.2635 4.99999 12 5C11.444 5 11 5.444 11 5.99V7H10C9.73478 7 9.48043 7.10536 9.29289 7.29289C9.10536 7.48043 9 7.73478 9 8C9 8.26522 9.10536 8.51957 9.29289 8.70711C9.48043 8.89464 9.73478 9 10 9H11V10.01C11.0026 10.2735 11.1092 10.5253 11.2964 10.7107C11.4837 10.896 11.7365 11 12 11C12.556 11 13 10.556 13 10.01V9H14C14.2652 9 14.5196 8.89464 14.7071 8.70711C14.8946 8.51957 15 8.26522 15 8C15 7.73478 14.8946 7.48043 14.7071 7.29289C14.5196 7.10536 14.2652 7 14 7H13Z"
			fill="currentColor"
		/>
	</svg>
);
