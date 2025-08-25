/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { abort, getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment, { UFOThirdPartySegment } from '@atlaskit/react-ufo/segment';

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
const SectionOne = ({
	base,
	appCreatedAt,
	onSectionComplete,
}: {
	base: number;
	appCreatedAt: number;
	onSectionComplete: () => void;
}) => {
	const [isWaitingForFinish, setIsWaitingForFinish] = useState(true);
	const visibleAt = useCounterToVisible(base);

	useEffect(() => {
		if (visibleAt) {
			const timeoutId = setTimeout(() => {
				setIsWaitingForFinish(false);
				onSectionComplete();
			}, 200);
			// Cleanup function to clear timeout
			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [visibleAt, onSectionComplete]);

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

const SectionTwo = ({
	base,
	appCreatedAt,
	onSectionComplete,
	onLoadingHoldStart,
}: {
	base: number;
	appCreatedAt: number;
	onSectionComplete: () => void;
	onLoadingHoldStart: () => void;
}) => {
	const [isWaitingForFinish, setIsWaitingForFinish] = useState(true);
	const visibleAt = useCounterToVisible(base);

	useEffect(() => {
		if (visibleAt) {
			// Notify that the loading hold has started
			onLoadingHoldStart();

			const timeoutId = setTimeout(() => {
				setIsWaitingForFinish(false);
				onSectionComplete();
			}, 800);
			// Cleanup function to clear timeout
			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [visibleAt, onSectionComplete, onLoadingHoldStart]);

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

const SectionThree = ({
	base,
	appCreatedAt,
	onSectionComplete,
}: {
	base: number;
	appCreatedAt: number;
	onSectionComplete: () => void;
}) => {
	const [isWaitingForFinish, setIsWaitingForFinish] = useState(true);
	const visibleAt = useCounterToVisible(base);

	useEffect(() => {
		if (visibleAt) {
			const timeoutId = setTimeout(() => {
				setIsWaitingForFinish(false);
				onSectionComplete();
			}, 20);
			// Cleanup function to clear timeout
			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [visibleAt, onSectionComplete]);

	if (!visibleAt) {
		return <UFOLoadHold name="loading" hold={isWaitingForFinish} />;
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
	const completedSections = useRef(new Set<string>());
	const sectionTwoLoadingHoldStarted = useRef(false);
	const abortTriggered = useRef(false);
	const interactionId = useRef<string | null>(null);

	// Get the interaction ID when the component mounts
	useEffect(() => {
		// Wait a bit for the interaction to be created
		const timer = setTimeout(() => {
			const activeInteraction = getActiveInteraction();
			if (activeInteraction) {
				interactionId.current = activeInteraction.id;
			}
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	const handleSectionComplete = (sectionName: string) => {
		completedSections.current.add(sectionName);

		// Check if SectionOne and SectionThree are complete, but SectionTwo's loading hold is still ongoing
		if (
			completedSections.current.has('section-one') &&
			completedSections.current.has('section-three') &&
			sectionTwoLoadingHoldStarted.current &&
			!abortTriggered.current &&
			interactionId.current
		) {
			abortTriggered.current = true;
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			if (interactionId.current) {
				console.log('Aborting interaction with ID:', interactionId.current);
				abort(interactionId.current, 'new_interaction');
			}
		}, 1200);
		return () => clearTimeout(timer);
	}, []);

	const handleSectionTwoLoadingHoldStart = () => {
		sectionTwoLoadingHoldStarted.current = true;
	};

	return (
		<UFOSegment name="app-root">
			<div data-testid="main" css={appStyle}>
				<SectionOne
					base={1}
					appCreatedAt={appCreatedAt}
					onSectionComplete={() => handleSectionComplete('section-one')}
				/>
				<UFOThirdPartySegment name="third-party-segment-example">
					<UFOSegment name="section-two-segment">
						<SectionTwo
							base={2}
							appCreatedAt={appCreatedAt}
							onSectionComplete={() => handleSectionComplete('section-two')}
							onLoadingHoldStart={handleSectionTwoLoadingHoldStart}
						/>
					</UFOSegment>
				</UFOThirdPartySegment>
				<SectionThree
					base={3}
					appCreatedAt={appCreatedAt}
					onSectionComplete={() => handleSectionComplete('section-three')}
				/>
			</div>
		</UFOSegment>
	);
}
