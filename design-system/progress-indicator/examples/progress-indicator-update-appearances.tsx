import React, { type ReactNode, useState } from 'react';

import Button from '@atlaskit/button/new';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { type ProgressDotsProps, ProgressIndicator } from '@atlaskit/progress-indicator';

const SpreadInlineLayout = ({ children }: { children: ReactNode }) => {
	return (
		<Inline space="space.100" spread="space-between" alignBlock="center">
			{children}
		</Inline>
	);
};

interface ExampleProps {
	selectedIndex: number;
	values: ProgressDotsProps['appearance'][];
}

const Example = ({
	values = ['default', 'inverted', 'primary', 'help'],
}: ExampleProps): React.JSX.Element => {
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
				<ProgressIndicator
					selectedIndex={selectedIndex}
					values={values}
					appearance={values[selectedIndex]}
				/>
				<Button isDisabled={selectedIndex === values.length - 1} onClick={handleNext}>
					Next
				</Button>
			</SpreadInlineLayout>
		</Box>
	);
};

export default Example;
