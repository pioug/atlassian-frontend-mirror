import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Inline, xcss } from '@atlaskit/primitives';
import { ProgressIndicator } from '@atlaskit/progress-indicator';

const containerStyles = xcss({
	padding: 'space.200',
	backgroundColor: 'color.background.neutral.bold',
});

const InvertedExample = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [values] = useState(['first', 'second', 'third']);

	const handlePrev = () => {
		setSelectedIndex((prevState) => prevState - 1);
	};

	const handleNext = () => {
		setSelectedIndex((prevState) => prevState + 1);
	};

	return (
		<Inline alignBlock="center" spread="space-between" xcss={containerStyles}>
			<Button isDisabled={selectedIndex === 0} onClick={handlePrev} appearance="primary">
				Previous
			</Button>
			<ProgressIndicator appearance="inverted" selectedIndex={selectedIndex} values={values} />
			<Button
				isDisabled={selectedIndex === values.length - 1}
				onClick={handleNext}
				appearance="primary"
			>
				Next
			</Button>
		</Inline>
	);
};

export default InvertedExample;
