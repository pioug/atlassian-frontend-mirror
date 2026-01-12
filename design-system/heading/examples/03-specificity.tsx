import React from 'react';

import Heading from '@atlaskit/heading';
import { Stack } from '@atlaskit/primitives/compiled';

const styles = `
.wiki-content h1 {
	font-size: 10px;
	color: red;
}

.wiki-content h2 {
	font-size: 10px;
	color: red;
}

.wiki-content h3 {
	font-size: 10px;
	color: red;
}

.wiki-content h4 {
	font-size: 10px;
	color: red;
}

.wiki-content h5 {
	font-size: 10px;
	color: red;
}

.wiki-content h6 {
	font-size: 10px;
	color: red;
}
`;

export default (): React.JSX.Element => {
	return (
		<div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles */}
			<style>{styles}</style>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop */}
			<div className="wiki-content">
				<Stack testId="headings" space="space.100">
					<Heading size="xxlarge" testId="heading-xxlarge">
						xxlarge
					</Heading>
					<Heading size="xlarge">xlarge</Heading>
					<Heading size="large">large</Heading>
					<Heading size="medium">medium</Heading>
					<Heading size="small">small</Heading>
					<Heading size="xsmall">xsmall</Heading>
					<Heading size="xxsmall">xxsmall</Heading>
				</Stack>
			</div>
		</div>
	);
};
