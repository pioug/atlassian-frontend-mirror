import React from 'react';

import { ExpandedFrame } from '@atlaskit/smart-card/expanded-frame';
export default function Preview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<ExpandedFrame
				frameStyle="show"
				href="https://example.atlassian.net/wiki/spaces/EXAMPLE/pages/1"
				text="Project overview"
				setOverflow={true}
				allowScrollBar={true}
			>
				<div>Embedded resource preview</div>
			</ExpandedFrame>
		</div>
	);
}
