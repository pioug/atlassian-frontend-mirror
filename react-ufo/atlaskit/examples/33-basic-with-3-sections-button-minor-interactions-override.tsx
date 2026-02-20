/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type MouseEvent as ReactMouseEvent,
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from 'react';

import { css, jsx } from '@compiled/react';

import { getConfig, setUFOConfig } from '@atlaskit/react-ufo/config';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';
import traceUFOInteraction from '@atlaskit/react-ufo/trace-interaction';

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

const appStyle = css({
	display: 'grid',
	gridTemplateColumns: 'repeat(3, 1fr)',
	gridTemplateAreas: `
    "sectionOne sectionTwo sectionThree"
  `,
	height: '100vh',
	fontSize: '1.2em',
});

const buttonStyle = css({
	padding: '8px 16px',
	backgroundColor: '#0052CC',
	color: 'white',
	border: 'none',
	borderRadius: '3px',
	cursor: 'pointer',
	fontSize: '14px',
	'&:hover': {
		backgroundColor: '#0052CCCC',
	},
});

// Custom hook for visibility delay
const useCounterToVisible = (base: number) => {
	const [visibleAt, setVisible] = useState<false | number>(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(performance.now());
		}, base * 1000);
		return () => clearTimeout(timer);
	}, [base]);

	return visibleAt;
};

// Define each section component using the custom hook
const SectionOne = ({ base }: { base: number }) => {
	const visibleAt = useCounterToVisible(base);
	const handleClick = useCallback((event: ReactMouseEvent<HTMLButtonElement>) => {
		traceUFOInteraction('test-new-interaction', event.nativeEvent);
	}, []);
	if (!visibleAt) {
		return <UFOLoadHold name="section-one"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionOne" css={sectionOneStyle}>
			<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>
			<button css={buttonStyle} data-interaction-name="test-new-interaction" onClick={handleClick}>
				new interaction button
			</button>
		</div>
	);
};

const SectionTwo = ({ base }: { base: number }) => {
	const visibleAt = useCounterToVisible(base);

	if (!visibleAt) {
		return <UFOLoadHold name="section-two"></UFOLoadHold>;
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
		return <UFOLoadHold name="section-three"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionThree" css={sectionThreeStyle}>
			<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>
		</div>
	);
};

// Main App component
export default function Example(): JSX.Element {
	useLayoutEffect(() => {
		const config = getConfig();
		// @ts-ignore
		setUFOConfig({
			...config,
			minorInteractions: ['test-new-interaction'],
		});
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
