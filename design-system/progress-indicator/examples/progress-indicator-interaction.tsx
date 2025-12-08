import React, { type ReactNode, useState } from 'react';

import { cx } from '@compiled/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { ProgressIndicator } from '@atlaskit/progress-indicator';

const styles = cssMap({
	displayBlock: { display: 'block' },
	displayNone: { display: 'none' },

	page: {
		maxWidth: '840px',
		marginInline: 'auto',
	},
});

const SpreadInlineLayout = ({ children }: { children: ReactNode }) => {
	return (
		<Inline space="space.100" spread="space-between" alignBlock="center">
			{children}
		</Inline>
	);
};

const Example = (): React.JSX.Element => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const values = ['first', 'second', 'third'];

	const handlePrev = () => {
		setSelectedIndex((prevState) => prevState - 1);
	};

	const handleNext = () => {
		setSelectedIndex((prevState) => prevState + 1);
	};

	const handleSelect = ({
		index: selectedIndex,
	}: {
		index: number;
	}): void => {
		setSelectedIndex(selectedIndex);
	};

	return (
		<Box xcss={styles.page}>
			<Box paddingBlock="space.400">
				{values.map((v, i) => {
					const selected = i === selectedIndex;
					const panelId = `custom-panel${i}`;
					return (
						<Box
							aria-hidden={!selected}
							aria-labelledby={`tab${i}`}
							key={v}
							id={panelId}
							role="tabpanel"
						>
							<Stack
								space="space.100"
								xcss={cx(styles.displayBlock, !selected && styles.displayNone)}
							>
								<Text as="strong">Panel {i + 1}</Text>
								<Lorem count={3} />
							</Stack>
						</Box>
					);
				})}
			</Box>
			<SpreadInlineLayout>
				<Button isDisabled={selectedIndex === 0} onClick={handlePrev}>
					Previous
				</Button>
				<ProgressIndicator
					onSelect={handleSelect}
					selectedIndex={selectedIndex}
					values={values}
					ariaControls="custom-panel"
					size="default"
					testId="progress-indicator"
				/>
				<Button isDisabled={selectedIndex === values.length - 1} onClick={handleNext}>
					Next
				</Button>
			</SpreadInlineLayout>
		</Box>
	);
};

export default Example;
