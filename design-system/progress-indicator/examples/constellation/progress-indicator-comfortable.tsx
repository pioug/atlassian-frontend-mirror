import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives';
import { ProgressIndicator } from '@atlaskit/progress-indicator';

const ComfortableExample = (): React.JSX.Element => {
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
			<ProgressIndicator spacing="comfortable" selectedIndex={selectedIndex} values={values} />
			<Button isDisabled={selectedIndex === values.length - 1} onClick={handleNext}>
				Next
			</Button>
		</Inline>
	);
};

export default ComfortableExample;
