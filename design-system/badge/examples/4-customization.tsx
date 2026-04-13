import React from 'react';

import Badge from '@atlaskit/badge';

export default (): React.JSX.Element => {
	return (
		<React.StrictMode>
			<div>
				<Badge
					max={1000}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ backgroundColor: '#DE350B', color: '#FFFFFF' }}
					testId="badge"
				>
					{1001}
				</Badge>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Badge style={{ backgroundColor: '#C0B6F2', color: '#403294' }}>
					<strong>10</strong>
				</Badge>
				<Badge>{1}</Badge>
				<Badge appearance="added">{1}</Badge>
				<Badge appearance="important">{1}</Badge>
				<Badge appearance="primary">{1}</Badge>
				<Badge appearance="primaryInverted">{1}</Badge>
				<Badge appearance="removed">{1}</Badge>
			</div>
		</React.StrictMode>
	);
};
