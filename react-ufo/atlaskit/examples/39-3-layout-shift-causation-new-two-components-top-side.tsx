/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

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
	height: '50vh',
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
			<div css={nestedChildStyle}>{generateNestedChain(depth, currentDepth + 1)}</div>
		</div>
	);
}

/**
 * Generates a nested DOM tree structure with configurable depth and width.
 * Creates `divsPerLevel` parallel chains, each going `depth` levels deep.
 * Total nodes = divsPerLevel * depth (linear, not exponential).
 */
function generateNestedDivs({ depth, divsPerLevel }: GenerateNestedDivsOptions): JSX.Element {
	const chains = Array.from({ length: divsPerLevel }, (_, index) => (
		<div key={index} css={nestedChildStyle} data-chain={index}>
			{generateNestedChain(depth, 1)}
		</div>
	));

	return <div css={nestedContainerStyle}>{chains}</div>;
}

export default function Example(): JSX.Element {
	const [showDelayedDiv, setShowDelayedDiv] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setShowDelayedDiv(true);
		}, 1000);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	return (
		<UFOSegment name="app-root">
			<main data-testid="main" css={mainStyles}>
				{showDelayedDiv ? (
					<div data-testid="delayed-div" css={[baseBlockStyles, delayedDivStyle]} />
				) : (
					<UFOLoadHold name="delayed-div__layout-shift" />
				)}
				<div data-testid="main-block-1" css={[baseBlockStyles, mainBlockStyles]}>
					{generateNestedDivs({ depth: 10, divsPerLevel: 10 })}
				</div>
				{showDelayedDiv ? (
					<div data-testid="delayed-div-middle" css={[baseBlockStyles, delayedDivStyle]} />
				) : (
					<UFOLoadHold name="delayed-div-middle__layout-shift" />
				)}
				<div data-testid="main-block-2" css={[baseBlockStyles, mainBlockStyles]}>
					{generateNestedDivs({ depth: 10, divsPerLevel: 10 })}
				</div>
			</main>
		</UFOSegment>
	);
}
