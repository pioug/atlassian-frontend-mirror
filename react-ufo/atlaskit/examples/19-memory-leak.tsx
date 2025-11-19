/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { Fragment, useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

const sectionOneStyle = css({
	backgroundColor: '#FFB3BA', // Pastel Red
	gridArea: 'sectionOne',
	height: '10vh',
});

const sectionTwoStyle = css({
	backgroundColor: '#FFDFBA', // Pastel Orange
	gridArea: 'sectionTwo',
	height: '10vh',
});

const sectionThreeStyle = css({
	backgroundColor: '#FFFFBA', // Pastel Yellow
	gridArea: 'sectionThree',
	height: '10vh',
});

// Define style for the main App component using the `css` function
const appStyle = css({
	display: 'grid',
	gridTemplateColumns: 'repeat(3, 1fr)',
	gridTemplateAreas: `
    "sectionOne sectionTwo sectionThree"
  `,
	height: '10vh',
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

let elements = [];
function createLeakingElements() {
	for (let i = 0; i < 1000; i++) {
		const element = document.createElement('div');
		element.innerHTML = `Element ${i}`;
		element.classList.add('for-memory-leak');
		element.style.padding = '10px';
		element.style.margin = '5px';
		element.style.background = 'lightblue';
		document.querySelector('#examples')?.appendChild(element);

		element.onclick = function () {
			console.log(`clicked ${element.innerHTML}`);
		};

		elements.push(element);
	}

	setTimeout(() => {
		document.querySelectorAll('div.for-memory-leak').forEach((el) => {
			el.remove();
		});
	}, 2000);
}

// Define each section component using the custom hook
const SectionOne = ({ base }: { base: number }) => {
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
				<button onClick={() => createLeakingElements()}>Create Memory Leak</button>
			</div>
		</Fragment>
	);
};

const SectionTwo = ({ base }: { base: number }) => {
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
			</div>
		</Fragment>
	);
};

const SectionThree = ({ base }: { base: number }) => {
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
			</div>
		</Fragment>
	);
};

// Main App component
export default function Example(): JSX.Element {
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
