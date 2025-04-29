/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

const sectionOneStyle = css({
	backgroundColor: '#FFB3BA', // Pastel Red
	gridArea: 'sectionOne',
	height: '100vh',
});

const sectionTwoStyle = css({
	backgroundColor: '#FFDFBA', // Pastel Orange
	gridArea: 'sectionTwo',
	height: '100vh',
});

const sectionThreeStyle = css({
	backgroundColor: '#FFFFBA', // Pastel Yellow
	gridArea: 'sectionThree',
	height: '100vh',
});

// Define style for the main App component using the `css` function
const appStyle = css({
	display: 'grid',
	gridTemplateColumns: 'repeat(3, 1fr)',
	gridTemplateAreas: `
    "sectionOne sectionTwo sectionThree"
  `,
	height: '100vh',
	fontSize: '1.2em',
});

// Custom hook for visibility delay
const useCounterToVisible = (base: number) => {
	const [visibleAt, setVisible] = useState<false | number>(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(performance.now());
		}, base * 500);
		return () => clearTimeout(timer);
	}, [base]);

	return visibleAt;
};

// Define each section component using the custom hook
const SectionOne = ({ base }: { base: number }) => {
	const visibleAt = useCounterToVisible(base);

	if (!visibleAt) {
		return <UFOLoadHold name="section-1"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionOne" css={sectionOneStyle}>
			<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>
		</div>
	);
};

const SectionTwo = ({ base }: { base: number }) => {
	const visibleAt = useCounterToVisible(base);

	if (!visibleAt) {
		return <UFOLoadHold name="section-2"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionTwo" css={sectionTwoStyle}>
			<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>
		</div>
	);
};

const SectionThree = ({ base }: { base: number }) => {
	const visibleAt = useCounterToVisible(base);

	if (!visibleAt) {
		return <UFOLoadHold name="section-3"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionThree" css={sectionThreeStyle}>
			<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>
		</div>
	);
};

// Main App component
export default function Example() {
	// NOTE: changed timeout only for the purposes of integration testing the UFO abort by timeout scenario
	useEffect(() => {
		const interaction = getActiveInteraction();
		interaction?.changeTimeout(500);
	}, []);

	return (
		<UFOSegment name="app-root">
			<div data-testid="main" css={appStyle}>
				<SectionOne base={1} />
				<SectionTwo base={2} />
				<SectionThree base={3} />
			</div>
		</UFOSegment>
	);
}
