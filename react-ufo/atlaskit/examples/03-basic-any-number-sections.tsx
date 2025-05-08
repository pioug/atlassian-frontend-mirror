/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React, { useEffect, useMemo, useState } from 'react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

// Custom hook for visibility delay
const useCounterToVisible = (base: number) => {
	const [visibleAt, setVisible] = useState<false | number>(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(performance.now());
		}, base * 25);
		return () => clearTimeout(timer);
	}, [base]);

	return visibleAt;
};

// Generic Section Component
const Section = ({
	base,
	appCreatedAt,
	backgroundColor,
	testId,
}: {
	base: number;
	appCreatedAt: number;
	backgroundColor: string;
	testId: string;
}) => {
	const [isWaitingForFinish, setIsWaitingForFinish] = useState(true);
	const visibleAt = useCounterToVisible(base);

	useEffect(() => {
		if (visibleAt) {
			setTimeout(() => {
				setIsWaitingForFinish(false);
			}, 200);
		}
	}, [visibleAt]);

	if (!visibleAt) {
		return <UFOLoadHold name={testId}></UFOLoadHold>;
	}

	return (
		<>
			<UFOLoadHold name="loading" hold={isWaitingForFinish} />
			<div
				data-testid={testId}
				style={{
					backgroundColor,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					height: '100%',
					fontSize: '10px',
				}}
			>
				<h2>Rendered: {Math.round(visibleAt)}ms</h2>
			</div>
		</>
	);
};

// Generate a list of background colors for the sections
const generateBackgroundColors = (count: number) => {
	const colors = [
		'#FFB3BA', // Pastel Red
		'#FFDFBA', // Pastel Orange
		'#FFFFBA', // Pastel Yellow
		'#BAFFC9', // Pastel Green
		'#BAE1FF', // Pastel Blue
		'#E1BAFF', // Pastel Purple
		'#FFB3E1', // Pastel Pink
		'#D1BAFF', // Pastel Violet
		'#BAFFD1', // Pastel Mint
		'#BAF7FF', // Pastel Aqua
	];

	// Repeat colors to accommodate the required count
	return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

// Main App component
export default function Example() {
	const appCreatedAt = useMemo(() => performance.now(), []);

	// Number of sections to render
	const numSections = 100; // Change this to any number (e.g., 10000)
	const sectionNumbers = Array.from({ length: numSections }, (_, i) => i + 1); // [1, 2, ..., numSections]
	const backgroundColors = generateBackgroundColors(numSections);

	// Calculate the grid layout to ensure all sections fit into the viewport
	const numColumns = Math.ceil(Math.sqrt(numSections)); // Number of columns in the grid
	const numRows = Math.ceil(numSections / numColumns); // Number of rows in the grid

	const sectionWidth = `${100 / numColumns}vw`; // Width of each section
	const sectionHeight = `${100 / numRows}vh`; // Height of each section

	return (
		<UFOSegment name="app-root">
			<div
				data-testid="main"
				style={{
					display: 'grid',
					gridTemplateColumns: `repeat(${numColumns}, ${sectionWidth})`,
					gridTemplateRows: `repeat(${numRows}, ${sectionHeight})`,
					width: '100vw',
					height: '100vh',
				}}
			>
				{sectionNumbers.map((num) => (
					<Section
						key={num}
						base={num}
						appCreatedAt={appCreatedAt}
						backgroundColor={backgroundColors[num - 1]}
						testId={`section${num}`}
					/>
				))}
			</div>
		</UFOSegment>
	);
}
