import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Inline } from '@atlaskit/primitives/compiled';
import { ProgressIndicator } from '@atlaskit/progress-indicator';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		backgroundColor: token('color.background.neutral.bold'),
	},
});

const InvertedExample = (): React.JSX.Element => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [values] = useState(['first', 'second', 'third']);

	const handlePrev = () => {
		setSelectedIndex((prevState) => prevState - 1);
	};

	const handleNext = () => {
		setSelectedIndex((prevState) => prevState + 1);
	};

	return (
		<Inline alignBlock="center" spread="space-between" xcss={styles.container}>
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
