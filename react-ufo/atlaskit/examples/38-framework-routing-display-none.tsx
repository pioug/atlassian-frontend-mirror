/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

/**
 * This example simulates a framework routing pattern where a container element
 * has its style toggled between empty and 'display: none !important;'.
 *
 * This pattern is commonly used by routing frameworks to hide/show route containers.
 * The UFO VC observer should classify these mutations as 'mutation:attribute:framework-routing'
 * and exclude them from TTVC calculation when the feature flag is enabled.
 */

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

// Style for the routing container - uses display: contents when visible
// so it has zero dimensions but children are still visible
const routingContainerStyle = css({
	display: 'contents',
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

// This component wraps content and simulates framework routing behavior
// by toggling display: none !important; style using direct DOM manipulation
// to match the exact format expected by the VC observer
const FrameworkRoutingContainer = ({
	children,
	testId,
	toggleDelay = 100,
}: {
	children: React.ReactNode;
	testId: string;
	toggleDelay?: number;
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Start with display: none !important; (exact format the VC observer expects)
		if (containerRef.current) {
			containerRef.current.setAttribute('style', 'display: none !important;');
		}

		// Simulate the framework showing this route after a short delay
		const timer = setTimeout(() => {
			if (containerRef.current) {
				// Remove the style (set to empty string) to show the content
				containerRef.current.setAttribute('style', '');
			}
		}, toggleDelay);

		return () => clearTimeout(timer);
	}, [toggleDelay]);

	// This is the exact pattern used by some routing frameworks:
	// style="" when visible, style="display: none !important;" when hidden
	// The container uses display: contents so it has zero dimensions (triggers zero-dimension handling)
	return (
		<div
			ref={containerRef}
			data-testid={testId}
			css={routingContainerStyle}
		>
			{children}
		</div>
	);
};

const SectionOne = ({ base, appCreatedAt }: { base: number; appCreatedAt: number }) => {
	const [isWaitingForFinish, setIsWaitingForFinish] = useState(true);
	const visibleAt = useCounterToVisible(base);

	useEffect(() => {
		if (visibleAt) {
			const timer = setTimeout(() => {
				setIsWaitingForFinish(false);
			}, 200);
			return () => clearTimeout(timer);
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
			const timer = setTimeout(() => {
				setIsWaitingForFinish(false);
			}, 200);
			return () => clearTimeout(timer);
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
			const timer = setTimeout(() => {
				setIsWaitingForFinish(false);
			}, 200);
			return () => clearTimeout(timer);
		}
	}, [visibleAt]);

	if (!visibleAt) {
		return <UFOLoadHold name="section-three"></UFOLoadHold>;
	}

	return (
		<Fragment>
			<UFOLoadHold name="loading" hold={isWaitingForFinish} />
			{/* Wrap sectionThree in a framework routing container that toggles display: none */}
			<FrameworkRoutingContainer testId="routingContainer" toggleDelay={50}>
				<div data-testid="sectionThree" css={sectionThreeStyle}>
					<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>
					<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>
				</div>
			</FrameworkRoutingContainer>
		</Fragment>
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
