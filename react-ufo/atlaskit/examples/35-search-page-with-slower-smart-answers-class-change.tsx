/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useLayoutEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { getConfig, setUFOConfig } from '@atlaskit/react-ufo/config';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';
import { updatePageloadName } from '@atlaskit/react-ufo/trace-pageload';

const searchResultStyle = css({
	backgroundColor: '#FFB3BA', // Pastel Red
	gridArea: 'searchResult',
	height: '100vh',
});

const smartAnswersStyle = css({
	backgroundColor: '#FFDFBA', // Pastel Orange
	gridArea: 'smartAnswers',
	height: '100vh',
});

// Define style for the main App component using the `css` function
const appStyle = css({
	display: 'grid',
	gridTemplateColumns: 'repeat(2, 1fr)',
	gridTemplateAreas: `
    "searchResult smartAnswers"
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

const DummySearchResult = () => {
	const visibleAt = useCounterToVisible(1);

	return (
		<UFOSegment name="search-result">
			{!visibleAt ? (
				<UFOLoadHold name="search-result"></UFOLoadHold>
			) : (
				<div data-testid="search-result" css={smartAnswersStyle}>
					<h2>Search Result</h2>
					<h2>Rendered at: {visibleAt.toFixed(2)} ms</h2>
				</div>
			)}
		</UFOSegment>
	);
};

/**
 * This SAIN component has attribute (class) mutations rather than element
 * mutations. The reason for this is to test if VC90 is correctly calculated
 * when the stored query selector is no longer present in the DOM at the time
 * of VC calculation. It should be noted that this is only possible when
 * data-testid is not specified, which emulates production elements.
 */
const DummySAIN = () => {
	const counterForClass0 = useCounterToVisible(2);
	const counterForClass1 = useCounterToVisible(3);

	return (
		<UFOSegment name="search-page-smart-answers">
			<div id="search-page-smart-answers">
				{!counterForClass0 && !counterForClass1 && (
					<UFOLoadHold name="search-ai-dialog-visible-text-loading"></UFOLoadHold>
				)}
				<div
					css={searchResultStyle}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={`${counterForClass0 ? 'class-0' : ''} ${counterForClass1 ? 'class-1' : ''}`}
				>
					<h2>Smart Answers</h2>
				</div>
			</div>
		</UFOSegment>
	);
};

export default function Example(): JSX.Element {
	useLayoutEffect(() => {
		updatePageloadName('search-page');

		const config = getConfig();

		// @ts-ignore
		setUFOConfig({
			...config,
			extraSearchPageInteraction: {
				enabled: true,
				searchPageMetricName: 'search-page',
				searchPageRoute: '/examples.html',
			},
		});
	}, []);

	return (
		<UFOSegment name="search-results">
			<div data-testid="main" css={appStyle}>
				<DummySearchResult />
				<DummySAIN />
			</div>
		</UFOSegment>
	);
}
