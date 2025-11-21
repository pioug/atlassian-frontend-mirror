import React from 'react';

import { Create } from '@atlaskit/atlassian-navigation';
import { token } from '@atlaskit/tokens';

const onClick = (...args: any[]) => {
	console.log('create click', ...args);
};
const StyledTooltip = () => (
	<span>
		Create
		<span
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				color: token('color.background.accent.orange.subtle'),
			}}
		>
			[c]
		</span>
	</span>
);

export const DefaultCreate = (): React.JSX.Element => (
	<Create
		buttonTooltip={<StyledTooltip />}
		iconButtonTooltip="Create button"
		onClick={onClick}
		text="Create"
		testId="create-cta"
	/>
);

export const GermanCreate = (): React.JSX.Element => (
	<Create
		buttonTooltip={<StyledTooltip />}
		iconButtonTooltip="Create button"
		onClick={onClick}
		text="Erstellen"
		testId="create-cta"
	/>
);

export const SpanishCreate = (): React.JSX.Element => (
	<Create
		buttonTooltip={<StyledTooltip />}
		iconButtonTooltip="Create button"
		onClick={onClick}
		text="Crear"
		testId="create-cta"
	/>
);

export const TurkishCreate = (): React.JSX.Element => (
	<Create
		buttonTooltip={<StyledTooltip />}
		iconButtonTooltip="Create button"
		onClick={onClick}
		text="Oluştur"
		testId="create-cta"
	/>
);

export const JapaneseCreate = (): React.JSX.Element => (
	<Create
		buttonTooltip={<StyledTooltip />}
		iconButtonTooltip="Create button"
		onClick={onClick}
		text="作成"
		testId="create-cta"
	/>
);
