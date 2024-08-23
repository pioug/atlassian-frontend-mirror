import React, { type FC, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';

import { ProgressIndicator } from '../src';

const SpreadInlineLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<Inline space="space.100" spread="space-between" alignBlock="center">
			{children}
		</Inline>
	);
};
interface ExampleProps {
	selectedIndex: number;
	values: string[];
}

type Sizes = 'default' | 'large';
type Spacing = 'comfortable' | 'cozy' | 'compact';

const sizes: Sizes[] = ['default', 'large'];
const spacings: Spacing[] = ['comfortable', 'cozy', 'compact'];

const Example: FC<ExampleProps> = ({ values = ['one', 'two', 'three'] }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handlePrev = () => {
		setSelectedIndex((prevState) => prevState - 1);
	};

	const handleNext = () => {
		setSelectedIndex((prevState) => prevState + 1);
	};

	return (
		<Box paddingInline="space.200" paddingBlock="space.200">
			<SpreadInlineLayout>
				<Button isDisabled={selectedIndex === 0} onClick={handlePrev}>
					Previous
				</Button>
				<Inline space="space.300" testId="vr-hook">
					{sizes.map((size) => (
						<Stack key={size} space="space.200">
							<Text weight="bold">{size}</Text>
							{spacings.map((space) => (
								<Stack key={space} space="space.100">
									<Text>{space}</Text>
									<ProgressIndicator
										selectedIndex={selectedIndex}
										values={values}
										size={size}
										spacing={space}
									/>
								</Stack>
							))}
						</Stack>
					))}
				</Inline>
				<Button isDisabled={selectedIndex === values.length - 1} onClick={handleNext}>
					Next
				</Button>
			</SpreadInlineLayout>
		</Box>
	);
};

export default Example;
