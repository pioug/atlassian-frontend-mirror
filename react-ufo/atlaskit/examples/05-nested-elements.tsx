/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

// Define style for the main App component using the `css` function
const appStyle = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	height: '100vh',
	width: '100vw',
	fontSize: '1.2em',
});

const sectionAStyle = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	height: '50%',
	width: '50%',
	backgroundColor: '#BAF7FF',
});

const sectionBStyle = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	height: '50%',
	width: '50%',
	backgroundColor: '#BAFFD1', // Pastel Mint
});

const sectionCStyle = css({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	height: '50%',
	width: '50%',
	backgroundColor: '#FFDFBA', // Pastel Orange
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

const SectionC = ({ base }: { base: number }) => {
	const visibleAt = useCounterToVisible(base);

	if (!visibleAt) {
		return <UFOLoadHold name="section-c"></UFOLoadHold>;
	}

	return <div data-testid="sectionC" data-nested="true" css={sectionCStyle}></div>;
};

const SectionB = ({ base }: { base: number }) => {
	const visibleAt = useCounterToVisible(base);

	if (!visibleAt) {
		return <UFOLoadHold name="section-b"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionB" data-nested="true" css={sectionBStyle}>
			<SectionC base={3} />
		</div>
	);
};
const SectionA = ({ base }: { base: number }) => {
	const visibleAt = useCounterToVisible(base);

	if (!visibleAt) {
		return <UFOLoadHold name="section-a"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionA" data-nested="true" css={sectionAStyle}>
			<SectionB base={2} />
		</div>
	);
};

// Main App component
export default function Example(): JSX.Element {
	return (
		<UFOSegment name="app-root">
			<div data-testid="main" css={appStyle}>
				<SectionA base={1} />
			</div>
		</UFOSegment>
	);
}
