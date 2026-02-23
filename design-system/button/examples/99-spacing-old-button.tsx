/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

const tableStyles = css({
	display: 'table',
});

const rowStyles = css({
	display: 'table-row',
});

const cellStyles = css({
	display: 'table-cell',
	paddingBlockEnd: token('space.050', '4px'),
	paddingBlockStart: token('space.050', '4px'),
	paddingInlineEnd: token('space.050', '4px'),
	paddingInlineStart: token('space.050', '4px')
});

const Table = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={tableStyles}>{props.children}</div>
);
const Row = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={rowStyles}>{props.children}</div>
);
const Cell = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={cellStyles}>{props.children}</div>
);

const ButtonSpacing = (): React.JSX.Element => (
	<Table>
		<Row>
			<Cell>
				<Button>Default</Button>
			</Cell>
			<Cell>
				<Button spacing="compact">Compact</Button>
			</Cell>
		</Row>
		<Row>
			<Cell>
				<Button appearance="link">Default</Button>
			</Cell>
			<Cell>
				<Button appearance="link" spacing="compact">
					Compact
				</Button>
			</Cell>
			<Cell>
				<Button appearance="link" spacing="none">
					None
				</Button>
			</Cell>
		</Row>
	</Table>
);

export default ButtonSpacing;
