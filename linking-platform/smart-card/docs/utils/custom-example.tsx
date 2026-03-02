import React, { type ComponentProps } from 'react';

import { Example } from '@atlaskit/docs';

type FlexibleUiExampleProps = {
	background?: boolean;
} & ComponentProps<typeof Example>;

const CustomExample = ({ background: _background, source, ...props }: FlexibleUiExampleProps) => {
	// Fix hover card entrypoint
	const replaceCode = source.replace('../src/hoverCard', '../src/hover-card');

	return <Example packageName="@atlaskit/smart-card" source={replaceCode} {...props} />;
};

export default CustomExample;
