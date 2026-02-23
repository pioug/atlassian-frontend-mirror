/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

/**
 * Number of delayed divs to render. Each one is added sequentially
 * after an initial 1s delay, with 200ms between each subsequent div.
 */
const TOTAL_DIVS_TO_ADD = 10;

/** Delay before the first div appears. */
const INITIAL_DELAY_MS = 1000;

const mainStyles = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	width: '100%',
});

const baseBlockStyles = css({
	margin: '20px',
	width: 'calc(100% - 40px)',
	boxSizing: 'border-box',
});

const mainBlockStyles = css({
	backgroundColor: '#f9f9f9',
	height: '100vh',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
});

const nestedContainerStyle = css({
	display: 'flex',
	flexDirection: 'row',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#ccc',
	padding: '8px',
	gap: '8px',
});

const nestedChildStyle = css({
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#aaa',
	padding: '4px',
	backgroundColor: 'rgba(200, 200, 255, 0.1)',
	flex: 1,
});

const delayedDivStyle = css({
	height: '10px',
	backgroundColor: '#ccc',
});

type GenerateNestedDivsOptions = {
	depth: number;
	divsPerLevel: number;
};

/**
 * Generates a single chain of nested divs going `depth` levels deep.
 */
function generateNestedChain(depth: number, currentDepth: number): JSX.Element {
	if (currentDepth >= depth) {
		return (
			<div css={nestedChildStyle} data-depth={currentDepth}>
				Leaf {currentDepth}
			</div>
		);
	}

	return (
		<div css={nestedContainerStyle} data-depth={currentDepth}>
			<div css={nestedChildStyle}>
				{generateNestedChain(depth, currentDepth + 1)}
			</div>
		</div>
	);
}

/**
 * Generates a nested DOM tree structure with configurable depth and width.
 * Creates `divsPerLevel` parallel chains, each going `depth` levels deep.
 * Total nodes = divsPerLevel * depth (linear, not exponential).
 */
function generateNestedDivs({
	depth,
	divsPerLevel,
}: GenerateNestedDivsOptions): JSX.Element {
	const chains = Array.from({ length: divsPerLevel }, (_, index) => (
		<div key={index} css={nestedChildStyle} data-chain={index}>
			{generateNestedChain(depth, 1)}
		</div>
	));

	return <div css={nestedContainerStyle}>{chains}</div>;
}

export default function Example(): JSX.Element {
	const [visibleCount, setVisibleCount] = useState(0);
	const rafRef = useRef<number | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const allRendered = visibleCount >= TOTAL_DIVS_TO_ADD;

	useEffect(() => {
		let cancelled = false;

		/**
		 * After the initial delay, adds one div per animation frame
		 * using requestAnimationFrame for the fastest possible cadence.
		 */
		function addNext(current: number) {
			if (cancelled || current >= TOTAL_DIVS_TO_ADD) {
				return;
			}
			rafRef.current = requestAnimationFrame(() => {
				if (cancelled) {
					return;
				}
				const next = current + 1;
				setVisibleCount(next);
				addNext(next);
			});
		}

		timeoutRef.current = setTimeout(() => {
			if (!cancelled) {
				setVisibleCount(1);
				addNext(1);
			}
		}, INITIAL_DELAY_MS);

		return () => {
			cancelled = true;
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
			}
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	return (
		<UFOSegment name="app-root">
			<main data-testid="main" css={mainStyles}>
				{Array.from({ length: visibleCount }, (_, i) => (
					<div key={i} data-testid={`delayed-div-${i}`} css={[baseBlockStyles, delayedDivStyle]} />
				))}
				{!allRendered && <UFOLoadHold name="delayed-div__layout-shift" />}
				<div data-testid="main-block" css={[baseBlockStyles, mainBlockStyles]}>
					{generateNestedDivs({ depth: 10, divsPerLevel: 10 })}
				</div>
			</main>
		</UFOSegment>
	);
}
