/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import ArrowLeftCircleIcon from '@atlaskit/icon/core/arrow-left';
import ArrowRightCircleIcon from '@atlaskit/icon/core/arrow-right';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { ProgressTracker, type Stages } from '@atlaskit/progress-tracker';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	buttonGroupStyles: {
		borderStyle: 'solid',
		borderWidth: token('border.width'),
	},
});

function createTrackerItems(stages: number, currentStage: number): Stages {
	let resultItems: Stages = [];
	for (let i = 0; i < stages; i++) {
		resultItems.push({
			id: i.toString(),
			percentageComplete: i < currentStage && i !== stages - 1 ? 100 : 0,
			status: i < currentStage ? 'visited' : 'unvisited',
			label: 'Stage ' + (i + 1),
		});
	}

	return resultItems;
}

const Tracker = ({ itemsNumber, currentStage }: { itemsNumber: number; currentStage: number }) => {
	const trackerItems = createTrackerItems(itemsNumber, currentStage);
	return <ProgressTracker testId="tracker" items={trackerItems} />;
};
const PrevIcon = () => <ArrowLeftCircleIcon spacing="spacious" label="prev" />;
const NextIcon = () => <ArrowRightCircleIcon spacing="spacious" label="next" />;
const MAX_STAGES = 5;

export default () => {
	const [itemsNumber, setItemsNumber] = useState(3);
	const [currentStage, setCurrentStage] = useState(0);
	return (
		<Stack space="space.100">
			<Tracker itemsNumber={itemsNumber} currentStage={currentStage} />
			<Box xcss={styles.buttonGroupStyles}>
				<Button
					onClick={() => {
						setCurrentStage(0);
						setItemsNumber(3);
					}}
				>
					Reset
				</Button>
				<Button
					testId="button--prev"
					appearance="subtle"
					onClick={() => setCurrentStage(Math.max(currentStage - 1, 0))}
					iconBefore={PrevIcon}
				>
					Previous Step
				</Button>
				<Button
					testId="button--next"
					appearance="subtle"
					onClick={() => setCurrentStage(Math.min(currentStage + 1, itemsNumber))}
					iconAfter={NextIcon}
				>
					Next Step
				</Button>
			</Box>

			<Inline space="space.100">
				<Button
					testId="button--add"
					onClick={() => setItemsNumber(Math.min(itemsNumber + 1, MAX_STAGES))}
				>
					Add Stage
				</Button>
				<Button
					testId="button--remove"
					onClick={() => {
						setItemsNumber(Math.max(itemsNumber - 1, 1));
						setCurrentStage(Math.min(itemsNumber - 1, currentStage));
					}}
				>
					Remove Stage
				</Button>
			</Inline>
		</Stack>
	);
};
