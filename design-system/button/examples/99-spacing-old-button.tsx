/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

const Table = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={{ display: 'table' }}>{props.children}</div>
);
const Row = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={{ display: 'table-row' }}>{props.children}</div>
);
const Cell = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={{ display: 'table-cell', padding: token('space.050', '4px') }}>{props.children}</div>
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
