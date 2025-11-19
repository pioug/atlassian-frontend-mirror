/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

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
		}, base * 250);
		return () => clearTimeout(timer);
	}, [base]);

	return visibleAt;
};

// Define each section component using the custom hook
const SectionOne = ({ base, appCreatedAt }: { base: number; appCreatedAt: number }) => {
	return (
		<UFOSegment name="section-one-segment">
			<div data-testid="sectionOne" css={sectionOneStyle}>
				<h2> Rendered at: 0 ms</h2>
				<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>
			</div>
		</UFOSegment>
	);
};

const SectionTwo = ({ base, appCreatedAt }: { base: number; appCreatedAt: number }) => {
	const [isWaitingForFinish, setIsWaitingForFinish] = useState(true);
	const visibleAt = useCounterToVisible(base);

	useEffect(() => {
		if (visibleAt) {
			const timeoutId = setTimeout(() => {
				setIsWaitingForFinish(false);
			}, 500);
			// Cleanup function to clear timeout
			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [visibleAt]);

	if (!visibleAt) {
		return <UFOLoadHold name="section-two"></UFOLoadHold>;
	}

	return (
		<UFOSegment name="section-two-segment">
			<UFOLoadHold name="loading" hold={isWaitingForFinish} />
			<div data-testid="sectionTwo" css={sectionTwoStyle}>
				<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>
				<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>
			</div>
		</UFOSegment>
	);
};

const SectionThree = ({ base, appCreatedAt }: { base: number; appCreatedAt: number }) => {
	const [isWaitingForFinish, setIsWaitingForFinish] = useState(true);
	const visibleAt = useCounterToVisible(base);

	useEffect(() => {
		if (visibleAt) {
			const timeoutId = setTimeout(() => {
				setIsWaitingForFinish(false);
			}, 1000);
			// Cleanup function to clear timeout
			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [visibleAt]);

	if (!visibleAt) {
		return <UFOLoadHold name="section-three"></UFOLoadHold>;
	}

	return (
		<UFOSegment name="section-three-segment">
			<UFOLoadHold name="loading" hold={isWaitingForFinish} />
			<div data-testid="sectionThree" css={sectionThreeStyle}>
				<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>
				<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>
			</div>
		</UFOSegment>
	);
};

// Main App component
export default function Example(): JSX.Element {
	const appCreatedAt = useMemo(() => performance.now(), []);
	const [isSectionOneMounted, setIsSectionOneMounted] = useState(true);

	useEffect(() => {
		let cycle = 0;
		const maxCycles = 3; // mount → unmount → mount

		const cycleTimer = setInterval(() => {
			cycle++;
			setIsSectionOneMounted(cycle % 2 === 1);

			if (cycle >= maxCycles) {
				clearInterval(cycleTimer);
			}
		}, 200);
		return () => clearInterval(cycleTimer);
	}, []);

	return (
		<UFOSegment name="app-root">
			<div data-testid="main" css={appStyle}>
				{isSectionOneMounted && <SectionOne base={1} appCreatedAt={appCreatedAt} />}
				<SectionTwo base={2} appCreatedAt={appCreatedAt} />
				<SectionThree base={3} appCreatedAt={appCreatedAt} />
			</div>
		</UFOSegment>
	);
}
