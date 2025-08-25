import React from 'react';

import { boolean } from '@storybook/addon-knobs';

import { JQLEditorReadOnly } from '../src';

import { Container } from './styled';

export type TemplateReadOnlyArgs = {
	isCompact?: boolean;
	isSearch?: boolean;
	query: string;
};

export const TemplateReadOnly = ({
	query,
	isSearch = true,
	isCompact = true,
}: TemplateReadOnlyArgs) => (
	<Container>
		<JQLEditorReadOnly
			isSearch={boolean('Search button', isSearch)}
			isCompact={boolean('Compact', isCompact)}
			query={query}
		/>
	</Container>
);
