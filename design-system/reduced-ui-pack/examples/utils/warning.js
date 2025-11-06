import React from 'react';

import SectionMessage from '@atlaskit/section-message';

export default () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<p style={{ paddingBottom: '8px' }}>
		<SectionMessage>
			<p>
				As this example is written in react, you will need to change <code>className</code> to{' '}
				<code>class</code> to render them in base html.
			</p>
		</SectionMessage>
	</p>
);
