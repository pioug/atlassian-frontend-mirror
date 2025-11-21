import React from 'react';

import Badge from '@atlaskit/badge';
import { N0, P500, P75, R400 } from '@atlaskit/theme/colors';

export default (): React.JSX.Element => {
	return (
		<React.StrictMode>
			<div>
				<Badge
					max={1000}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ backgroundColor: R400, color: N0 }}
					testId="badge"
				>
					{1001}
				</Badge>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<Badge style={{ backgroundColor: P75, color: P500 }}>
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
