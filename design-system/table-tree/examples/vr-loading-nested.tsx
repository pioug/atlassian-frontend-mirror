/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '@atlaskit/table-tree';

import staticData from './data-cleancode-toc.json';

/**
 * For VR testing purposes we are overriding the animation timing
 * for both the fade-in and the rotating animations. This will
 * freeze the spinner, avoiding potential for VR test flakiness.
 */
const animationStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'svg, span': {
		animationDuration: '0s',
		animationTimingFunction: 'step-end',
	},
});

type Item = {
	title: string;
	numbering: string;
	page: number;
	children?: Item[];
};

export default () => (
	<div css={animationStyles}>
		<TableTree>
			<Headers>
				<Header width={200}>Chapter title</Header>
				<Header width={120}>Numbering</Header>
				<Header width={100}>Page</Header>
			</Headers>
			<Rows
				items={staticData.children}
				render={({ title, numbering, page, children = [] }: Item) => (
					<Row
						itemId={numbering}
						items={undefined}
						hasChildren={children.length > 0}
						isDefaultExpanded
					>
						<Cell singleLine>{title}</Cell>
						<Cell>{numbering}</Cell>
						<Cell>{page}</Cell>
					</Row>
				)}
			/>
		</TableTree>
	</div>
);
