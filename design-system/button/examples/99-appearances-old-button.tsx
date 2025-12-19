/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { type Appearance, LoadingButton as Button } from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
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

const Table = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={{ display: 'table' }}>{props.children}</div>
);
const Row = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={{ display: 'flex', flexWrap: 'wrap' }}>{props.children}</div>
);
const Cell = (props: React.HTMLProps<HTMLDivElement>) => (
	<div css={{ width: '100px', padding: `${token('space.050', '4px')} 0` }}>{props.children}</div>
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
