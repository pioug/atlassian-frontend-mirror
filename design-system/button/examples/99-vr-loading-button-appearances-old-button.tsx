/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { type Appearance, LoadingButton as Button } from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

const appearances: Appearance[] = [
	'default',
	'primary',
	'link',
	'subtle',
	'subtle-link',
	'warning',
	'danger',
];

const tableStyles = css({
	display: 'table',
});

const rowStyles = css({
	display: 'flex',
	flexWrap: 'wrap',
});

const cellStyles = css({
	width: '100px',
	paddingBlockEnd: token('space.050', '4px'),
	paddingBlockStart: token('space.050', '4px'),
	paddingInlineEnd: 0,
	paddingInlineStart: 0,
});

/**
 * For VR testing purposes we are overriding the animation timing
 * for both the fade-in and the rotating animations. This will
 * freeze the spinner, avoiding potential for VR test flakiness.
 */
const animationStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'svg, span': {
		animationDuration: '0s',
		animationTimingFunction: 'step-end',
	},
});

const Table = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={tableStyles}>{props.children}</div>
);
const Row = (props: React.HTMLProps<HTMLDivElement>) => <div css={rowStyles}>{props.children}</div>;
const Cell = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={cellStyles}>{props.children}</div>
);

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Example(): React.JSX.Element {
	return (
		<div css={animationStyles}>
			<Table>
				{appearances.map((a) => (
					<Row key={a}>
						<Cell>
							<Button isLoading={true} appearance={a}>
								{capitalize(a)}
							</Button>
						</Cell>
						<Cell>
							<Button isLoading={true} appearance={a} isDisabled={true}>
								Disabled
							</Button>
						</Cell>
						<Cell>
							<Button isLoading={true} appearance={a} isSelected={true}>
								Selected
							</Button>
						</Cell>
					</Row>
				))}
			</Table>
		</div>
	);
}
