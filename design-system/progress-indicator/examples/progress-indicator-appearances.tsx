import React from 'react';

import { Box } from '@atlaskit/primitives/compiled';
import { ProgressIndicator } from '@atlaskit/progress-indicator';

const Wrapper = ({ children, isInverted }: { children: React.ReactNode; isInverted?: boolean }) => {
	return (
		<Box
			padding="space.200"
			backgroundColor={isInverted ? 'color.background.neutral.bold' : undefined}
		>
			{children}
		</Box>
	);
};

const AppearancesExample = () => {
	return (
		<Box>
			<Wrapper>
				<ProgressIndicator
					testId="progress-indicator"
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
