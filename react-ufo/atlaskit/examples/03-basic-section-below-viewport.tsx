/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

const baseStyle = css({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '50vh',
	width: '100vw',
});

const sectionOneStyle = css({
	backgroundColor: '#FFB3BA', // Pastel Red
	gridArea: 'sectionOne',
});

const sectionTwoStyle = css({
	backgroundColor: '#FFDFBA', // Pastel Orange
	gridArea: 'sectionTwo',
});

const sectionThreeStyle = css({
	backgroundColor: '#FFFFBA', // Pastel Yellow
	gridArea: 'sectionThree',
});

// Define style for the main App component using the `css` function
const appStyle = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	fontSize: '1.2em',
	minWidth: '100vw',
	minHeight: '150vh', // above 100% of the viewport height to ensure content is below viewport
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
	const visibleAt = useCounterToVisible(base);
	if (!visibleAt) {
		return <UFOLoadHold name="section-1"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionOne" css={[baseStyle, sectionOneStyle]}>
			<div>
				<h2>Section One</h2>
				<h3>Rendered at: {visibleAt.toFixed(2)} ms</h3>
				<h4>App created at: {appCreatedAt.toFixed(2)} ms</h4>
			</div>
		</div>
	);
};

const SectionTwo = ({ base, appCreatedAt }: { base: number; appCreatedAt: number }) => {
	const visibleAt = useCounterToVisible(base);

	if (!visibleAt) {
		return <UFOLoadHold name="section-2"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionTwo" css={[baseStyle, sectionTwoStyle]}>
			<div>
				<h2>Section Two</h2>
				<h3>Rendered at: {visibleAt.toFixed(2)} ms</h3>
				<h4>App created at: {appCreatedAt.toFixed(2)} ms</h4>
			</div>
		</div>
	);
};

const SectionThree = ({ base, appCreatedAt }: { base: number; appCreatedAt: number }) => {
	const visibleAt = useCounterToVisible(base);

	if (!visibleAt) {
		return <UFOLoadHold name="section-3"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionThree" css={[baseStyle, sectionThreeStyle]}>
			<div>
				<h2>Section Three</h2>
				<h3>Rendered at: {visibleAt.toFixed(2)} ms</h3>
				<h4>App created at: {appCreatedAt.toFixed(2)} ms</h4>
			</div>
		</div>
	);
};

// Main App component
export default function Example(): JSX.Element {
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
