/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLabel from '@atlaskit/react-ufo/label';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';
import { updatePageloadName } from '@atlaskit/react-ufo/trace-pageload';

const topLevelStyle = css({
	backgroundColor: '#FFB3BA', // Pastel Red
	padding: '20px',
	borderColor: '#FF0000',
	borderStyle: 'solid',
	borderWidth: '2px',
	marginBottom: '20px',
});

const memoizedStyle = css({
	backgroundColor: '#BAFFC9', // Pastel Green
	padding: '20px',
	borderColor: '#00FF00',
	borderStyle: 'solid',
	borderWidth: '2px',
	marginBottom: '20px',
});

const nestedStyle = css({
	backgroundColor: '#FFDFBA', // Pastel Orange
	padding: '20px',
	borderColor: '#FFA500',
	borderStyle: 'solid',
	borderWidth: '2px',
	marginBottom: '20px',
});

const cpuHeavyStyle = css({
	backgroundColor: '#BAE1FF', // Pastel Blue
	padding: '20px',
	borderColor: '#0000FF',
	borderStyle: 'solid',
	borderWidth: '2px',
	marginBottom: '20px',
});

const appStyle = css({
	padding: '20px',
	fontSize: '1rem',
	fontFamily: 'Arial, sans-serif',
});

// Hook that updates every 100ms with a counter, stops after 10 iterations
const useFrequentCounter = (componentName: string) => {
	const [counter, setCounter] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (counter >= 10) {
			return;
		}

		const timer = setInterval(() => {
			setTimeout(() => {
				setCounter((prev) => {
					const nextValue = prev + 1;
					if (nextValue >= 10) {
						// Set loading to false only when reaching the last value
						setIsLoading(false);
					}
					return nextValue;
				});
			}, 50);
		}, 100);

		return () => clearInterval(timer);
	}, [counter]);

	return { counter, isLoading, loadHoldName: `${componentName}-loading-${counter}` };
};

// CPU-heavy component that runs a blocking loop for ~50ms
const CPUHeavyComponent = () => {
	const executionTimeRef = useRef(0);

	const start = performance.now();
	let sum = 0;

	// Run CPU-intensive operation for approximately 50ms
	while (performance.now() - start < 150) {
		sum += Math.random();
	}

	const end = performance.now();
	executionTimeRef.current = end - start;
	console.log('CPU HEAVY', executionTimeRef.current, sum);

	return (
		<div css={cpuHeavyStyle} data-testid="cpu-heavy">
			<h3>🔥 CPU Heavy Component</h3>
			<p>Execution time: {executionTimeRef.current.toFixed(2)} ms</p>
			<p>This component blocks the main thread with heavy computation</p>
		</div>
	);
};

// Frequently updating nested component (inside memoized component)
const FrequentlyUpdatingNestedComponent = ({ children }: { children?: React.ReactNode }) => {
	console.count('FrequentlyUpdatingNestedComponent');
	const { counter, isLoading, loadHoldName } = useFrequentCounter('nested');
	console.log('NESTED', counter, isLoading);

	return (
		<div css={nestedStyle} data-testid="nested-frequent">
			<h3>🔄 Frequently Updating Nested Component</h3>
			<p>Counter: {counter}</p>
			<p>Updates every 100ms</p>
			<UFOLoadHold name={loadHoldName} hold={isLoading} />
			{children}
		</div>
	);
};

// Memoized middle component (should not re-render unless props change)
const MemoizedMiddleComponent = memo(({ children }: { children?: React.ReactNode }) => {
	const [renderCount, setRenderCount] = useState(0);

	useEffect(() => {
		setRenderCount((prev) => prev + 1);
	}, []);

	return (
		<div css={memoizedStyle} data-testid="memoized-middle">
			<h3>✅ Memoized Middle Component</h3>
			<p>Render count: {renderCount}</p>
			<p>This component is wrapped with memo and should not re-render</p>
			{children}
		</div>
	);
});

MemoizedMiddleComponent.displayName = 'MemoizedMiddleComponent';

// Top level component that updates frequently
const TopLevelFrequentComponent = ({ children }: { children?: React.ReactNode }) => {
	console.count('TopLevelFrequentComponent');
	const { counter, isLoading, loadHoldName } = useFrequentCounter('top-level');

	return (
		<div css={topLevelStyle} data-testid="top-level-frequent">
			<h2>🔴 Top Level Frequently Updating Component</h2>
			<p>Counter: {counter}</p>
			<p>Updates every 100ms</p>
			<UFOLoadHold name={loadHoldName} hold={isLoading} />
			{children}
		</div>
	);
};

const TestComponent = () => {
	return (
		<div>
			<div>asd</div>
			<div>asd</div>
		</div>
	);
};

export default function Example(): JSX.Element {
	useLayoutEffect(() => {
		updatePageloadName('poorly-performing-page');
	}, []);

	return (
		<UFOSegment name="poorly-performing-root">
			<div css={appStyle} data-testid="main">
				<h1>Performance Test: Poorly Performing Components</h1>
				<p>This example demonstrates components with various performance characteristics:</p>
				<ul>
					<li>Top level component updates every 100ms (contains middle component)</li>
					<li>Middle component is memoized (should not re-render)</li>
					<li>Nested component inside memoized one updates every 100ms</li>
					<li>CPU heavy component blocks the main thread</li>
				</ul>

				<UFOSegment name="top-level-frequent">
					<TopLevelFrequentComponent>
						{/* <UFOLabel name="ufo-label-test-updated"> */}
						<UFOSegment name="memoized-middle">
							<MemoizedMiddleComponent>
								<UFOSegment name="frequently-updating-nested">
									<FrequentlyUpdatingNestedComponent />
								</UFOSegment>
							</MemoizedMiddleComponent>
						</UFOSegment>

						{/* Optional: Add CPU heavy component as child */}
						<UFOSegment name="cpu-heavy-component">
							<CPUHeavyComponent />
						</UFOSegment>
						{/* </UFOLabel> */}
						<UFOLabel name="ufo-label-test-2">
							<TestComponent />
						</UFOLabel>
						<UFOSegment name="multi-components-one-wrapper">
							<CPUHeavyComponent />
							<UFOSegment name="multi-components-heavy">
								<CPUHeavyComponent />
							</UFOSegment>
							<CPUHeavyComponent />
							<FrequentlyUpdatingNestedComponent>
								<CPUHeavyComponent />
							</FrequentlyUpdatingNestedComponent>
							<FrequentlyUpdatingNestedComponent />
							<FrequentlyUpdatingNestedComponent />
						</UFOSegment>
						<UFOSegment name="multi-components-multi-wrappers">
							<UFOSegment name="multi-components-nested">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
						</UFOSegment>
						<UFOSegment name="multi-components-list-wrappers">
							<UFOSegment name="multi-components-nested" mode="list">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested" mode="list">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested" mode="list">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested" mode="list">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested" mode="list">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
						</UFOSegment>
						<UFOSegment name="multi-components-mixed-wrappers">
							<CPUHeavyComponent />
							<UFOSegment name="multi-components-heavy">
								<CPUHeavyComponent />
							</UFOSegment>
							<CPUHeavyComponent />
							<FrequentlyUpdatingNestedComponent>
								<CPUHeavyComponent />
							</FrequentlyUpdatingNestedComponent>
							<FrequentlyUpdatingNestedComponent />
							<FrequentlyUpdatingNestedComponent />
							<UFOSegment name="multi-components-nested">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested" mode="list">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested" mode="list">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
							<UFOSegment name="multi-components-nested" mode="list">
								<FrequentlyUpdatingNestedComponent />
							</UFOSegment>
						</UFOSegment>
					</TopLevelFrequentComponent>
				</UFOSegment>
			</div>
		</UFOSegment>
	);
}
