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
	flexDirection: 'row',
	alignItems: 'center',
	width: '100%',
});

const mainBlockStyles = css({
	margin: '20px 0',
	width: '50vw',
	boxSizing: 'border-box',
	backgroundColor: '#f9f9f9',
	height: '100vh',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
	overflow: 'hidden',
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
	margin: '0',
	width: '40px',
	height: '10px',
	backgroundColor: '#ccc',
	justifySelf: 'right',
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
					<div data-testid="delayed-div" css={delayedDivStyle} />
				) : (
					<UFOLoadHold name="delayed-div__layout-shift" />
				)}
				<div data-testid="main-block" css={mainBlockStyles}>
					{generateNestedDivs({ depth: 10, divsPerLevel: 10 })}
				</div>
			</main>
		</UFOSegment>
	);
}
