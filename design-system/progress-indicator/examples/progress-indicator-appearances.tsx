import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';
import { ProgressIndicator } from '@atlaskit/progress-indicator';

const invertedBackgroundStyles = xcss({
	backgroundColor: 'color.background.neutral.bold',
});

const Wrapper = ({ children, isInverted }: { children: React.ReactNode; isInverted?: boolean }) => {
	return (
		<Box padding="space.200" xcss={isInverted && invertedBackgroundStyles}>
			{children}
		</Box>
	);
};

const AppearancesExample = () => {
	return (
		<Box>
			<Wrapper>
				<ProgressIndicator
					selectedIndex={0}
					values={['one', 'two', 'three']}
					appearance="default"
				/>
			</Wrapper>
			<Wrapper>
				<ProgressIndicator selectedIndex={0} values={['one', 'two', 'three']} appearance="help" />
			</Wrapper>
			<Wrapper>
				<ProgressIndicator
					selectedIndex={0}
					values={['one', 'two', 'three']}
					appearance="primary"
				/>
			</Wrapper>
			<Wrapper isInverted>
				<ProgressIndicator
					selectedIndex={0}
					values={['one', 'two', 'three']}
					appearance="inverted"
				/>
			</Wrapper>
		</Box>
	);
};

export default AppearancesExample;
