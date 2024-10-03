import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Inline } from '@atlaskit/primitives';

import { ProgressIndicator } from '../../src';

const PrimaryExample = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [values] = useState(['first', 'second', 'third']);

	const handlePrev = () => {
		setSelectedIndex((prevState) => prevState - 1);
	};

	const handleNext = () => {
		setSelectedIndex((prevState) => prevState + 1);
	};

	return (
		<Inline alignBlock="center" spread="space-between">
			<Button isDisabled={selectedIndex === 0} onClick={handlePrev}>
				Previous
			</Button>
			<ProgressIndicator appearance="primary" selectedIndex={selectedIndex} values={values} />
			<Button isDisabled={selectedIndex === values.length - 1} onClick={handleNext}>
				Next
			</Button>
		</Inline>
	);
};

export default PrimaryExample;
