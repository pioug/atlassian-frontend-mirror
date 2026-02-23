/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { css, jsx } from '@compiled/react';

import { type Appearance, LoadingButton as Button } from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import { token } from '@atlaskit/tokens';

const tableStyles = css({
	display: 'table',
});

const cellStyles = css({
	width: '100px',
	paddingBlockEnd: token('space.050', '4px'),
	paddingBlockStart: token('space.050', '4px'),
	paddingInlineEnd: 0,
	paddingInlineStart: 0
});

const rowStyles = css({
	display: 'flex',
	flexWrap: 'wrap',
});

const appearances: Appearance[] = [
	'default',
	'primary',
	'link',
	'subtle',
	'subtle-link',
	'warning',
	'danger',
];

const Table = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={tableStyles}>{props.children}</div>
);
const Row = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={rowStyles}>{props.children}</div>
);
const Cell = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={cellStyles}>{props.children}</div>
);

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Example(): React.JSX.Element {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	return (
		<div aria-live="polite">
			<Checkbox
				label="Show Loading State"
				isChecked={isLoading}
				onChange={() => setIsLoading((value) => !value)}
			/>
			<Table>
				{appearances.map((a) => (
					<Row key={a}>
						<Cell>
							<Button isLoading={isLoading} appearance={a}>
								{capitalize(a)}
							</Button>
						</Cell>
						<Cell>
							<Button isLoading={isLoading} appearance={a} isDisabled={true}>
								Disabled
							</Button>
						</Cell>
						<Cell>
							<Button isLoading={isLoading} appearance={a} isSelected={true}>
								Selected
							</Button>
						</Cell>
					</Row>
				))}
			</Table>
		</div>
	);
}
