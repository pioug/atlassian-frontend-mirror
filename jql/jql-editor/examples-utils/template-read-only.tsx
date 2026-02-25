import React from 'react';

import { JQLEditorReadOnly } from '../src';

import { Container } from './styled';

// These were used for the knobs addon, but stopped working after the Storybook 8 migration.
// You can read about how to bring back controls here: https://hello.atlassian.net/wiki/x/J5bdgwE
const controls = {
	isSearch: {
		control: 'boolean' as const,
		name: 'Search button',
		defaultValue: true,
	},
	isCompact: {
		control: 'boolean' as const,
		name: 'Compact',
		defaultValue: true,
	},
};

export type TemplateReadOnlyArgs = {
	isCompact?: boolean;
	isSearch?: boolean;
	query: string;
};

export const TemplateReadOnly = ({
	query,
	isSearch = controls.isSearch.defaultValue,
	isCompact = controls.isCompact.defaultValue,
}: TemplateReadOnlyArgs) => (
	<Container>
		<JQLEditorReadOnly isSearch={isSearch} isCompact={isCompact} query={query} />
	</Container>
);
