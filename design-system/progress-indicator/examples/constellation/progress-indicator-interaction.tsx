import React, { type ReactNode, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';

import { ProgressIndicator } from '../../src';

const SpreadInlineLayout = ({ children }: { children: ReactNode }) => {
	return (
		<Inline space="space.100" spread="space-between" alignBlock="center">
			{children}
		</Inline>
	);
};

const displayBlockStyles = xcss({ display: 'block' });
const displayNoneStyles = xcss({ display: 'none' });

const pageStyles = xcss({
	maxWidth: '840px',
	marginInline: 'auto',
});

const Example = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const values = ['first', 'second', 'third'];

	const handlePrev = () => {
		setSelectedIndex((prevState) => prevState - 1);
	};

	const handleNext = () => {
		setSelectedIndex((prevState) => prevState + 1);
	};

	const handleSelect = ({
		event,
		index: selectedIndex,
	}: {
		event: React.MouseEvent<HTMLButtonElement>;
		index: number;
	}): void => {
		setSelectedIndex(selectedIndex);
	};

	return (
		<Box xcss={pageStyles}>
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
							<Stack space="space.100" xcss={selected ? displayBlockStyles : displayNoneStyles}>
								<Text as="strong">Panel {i + 1}</Text>
								<Lorem count={1} />
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
					ariaControls="custom-panel"
					selectedIndex={selectedIndex}
					values={values}
				/>
				<Button isDisabled={selectedIndex === values.length - 1} onClick={handleNext}>
					Next
				</Button>
			</SpreadInlineLayout>
		</Box>
	);
};

export default Example;
