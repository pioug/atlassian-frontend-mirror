/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { Fragment, useEffect, useMemo, useState } from 'react';

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
		return <UFOLoadHold name="section-one"></UFOLoadHold>;
	}

	return (
		<Fragment>
			<UFOLoadHold name="loading" hold={isWaitingForFinish} />
			<div data-testid="sectionOne" css={sectionOneStyle}>
				<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>
				<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>
			</div>
		</Fragment>
	);
};

const SectionTwo = ({ base, appCreatedAt }: { base: number; appCreatedAt: number }) => {
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
		return <UFOLoadHold name="section-two"></UFOLoadHold>;
	}

	return (
		<Fragment>
			<UFOLoadHold name="loading" hold={isWaitingForFinish} />
			<div data-testid="sectionTwo" css={sectionTwoStyle}>
				<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>
				<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>
			</div>
		</Fragment>
	);
};

const SectionThree = ({ base, appCreatedAt }: { base: number; appCreatedAt: number }) => {
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
		return <UFOLoadHold name="section-three"></UFOLoadHold>;
	}

	return (
		<Fragment>
			<UFOLoadHold name="loading" hold={isWaitingForFinish} />
			<div data-testid="sectionThree" css={sectionThreeStyle}>
				<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>
				<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>
			</div>
		</Fragment>
	);
};

// Main App component
export default function Example() {
	const appCreatedAt = useMemo(() => performance.now(), []);

	return (
		<UFOSegment name="app-root">
			<div data-testid="main" css={appStyle}>
				<SectionOne base={1} appCreatedAt={appCreatedAt} />
				<SectionTwo base={2} appCreatedAt={appCreatedAt} />
				<SectionThree base={3} appCreatedAt={appCreatedAt} />
			</div>
		</UFOSegment>
	);
}
