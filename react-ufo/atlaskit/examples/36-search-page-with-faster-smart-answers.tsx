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
	const visibleAt = useCounterToVisible(2);

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

const DummySAIN = () => {
	const visibleAt = useCounterToVisible(1);

	return (
		<UFOSegment name="search-page-smart-answers">
			<div id="search-page-smart-answers">
				{!visibleAt ? (
					<UFOLoadHold name="search-ai-dialog-visible-text-loading"></UFOLoadHold>
				) : (
					<div data-testid="smart-answers" css={searchResultStyle}>
						<h2>Smart Answers</h2>
						<h2>Rendered at: {visibleAt.toFixed(2)} ms</h2>
					</div>
				)}
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
