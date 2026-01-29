/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';
import { useReportTerminalError } from '@atlaskit/react-ufo/set-terminal-error';

const sectionOneStyle = css({
	backgroundColor: '#FFB3BA',
	gridArea: 'sectionOne',
	height: '100vh',
});

const sectionTwoStyle = css({
	backgroundColor: '#FFDFBA',
	gridArea: 'sectionTwo',
	height: '100vh',
});

const sectionThreeStyle = css({
	backgroundColor: '#FFFFBA',
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

const SectionOne = ({ base }: { base: number }) => {
	const visibleAt = useCounterToVisible(base);

	const error = useMemo(() => {
		if (visibleAt) {
			return new Error('Terminal error occurred in SectionOne');
		}
		return null;
	}, [visibleAt]);

	useReportTerminalError(error, {
		teamName: 'ufo-team',
		packageName: 'react-ufo',
		errorBoundaryId: 'section-one-boundary',
		fallbackType: 'page',
	});

	if (!visibleAt) {
		return <UFOLoadHold name="section-one"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionOne" css={sectionOneStyle}>
			<h2>Rendered at: {visibleAt.toFixed(2)} ms</h2>
			<p>Terminal error was triggered!</p>
		</div>
	);
};

const SectionTwo = ({ base }: { base: number }) => {
	const visibleAt = useCounterToVisible(base);

	const errorWhileHoldActive = useMemo(() => {
		if (!visibleAt) {
			return new Error('Terminal error occurred in SectionTwo while hold active');
		}
		return null;
	}, [visibleAt]);

	useReportTerminalError(errorWhileHoldActive, {
		teamName: 'ufo-team',
		packageName: 'react-ufo',
		errorBoundaryId: 'section-two-boundary-with-hold',
		fallbackType: 'flag',
	});

	if (!visibleAt) {
		return <UFOLoadHold name="section-two"></UFOLoadHold>;
	}

	return (
		<div data-testid="sectionTwo" css={sectionTwoStyle}>
			<h2>Rendered at: {visibleAt.toFixed(2)} ms</h2>
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
			<h2>Rendered at: {visibleAt.toFixed(2)} ms</h2>
		</div>
	);
};

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
