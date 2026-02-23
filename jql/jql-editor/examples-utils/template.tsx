import React, { useCallback, useState } from 'react';

import { action } from '@storybook/addon-actions';
import { DiProvider, type Injectable } from 'react-magnetic-di';
import { defaults as stateDefaults } from 'react-sweet-state';

import { useAutocompleteProvider } from '@atlaskit/jql-editor-autocomplete-rest';

import { JQLEditor, JQLEditorAnalyticsListener } from '../src';
import { type ExternalMessage } from '../src/state/types';

import { getAutocompleteInitialData, getAutocompleteSuggestions } from './autocomplete';
import { onHydrate } from './hydration';
import { LocaleProvider } from './locale-provider';
import { Container } from './styled';

// These were used for the knobs addon, but stopped working after the Storybook 8 migration.
// You can read about how to bring back controls here: https://hello.atlassian.net/wiki/x/J5bdgwE
const controls = {
	batchUpdates: {
		control: 'boolean' as const,
		name: 'Batch updates',
		defaultValue: true,
	},
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

export type TemplateArgs = {
	batchUpdates?: boolean;
	defaultRows?: number;
	deps?: Injectable[];
	Editor?: typeof JQLEditor;
	enableRichInlineNodes?: boolean;
	isCompact?: boolean;
	isSearch?: boolean;
	messages?: ExternalMessage[];
	query: string;
};

export const Template = ({
	query,
	messages,
	isSearch = controls.isSearch.defaultValue,
	isCompact = controls.isCompact.defaultValue,
	enableRichInlineNodes = true,
	batchUpdates = controls.batchUpdates.defaultValue,
	Editor = JQLEditor,
	deps = [],
	defaultRows,
}: TemplateArgs) => {
	// @ts-ignore
	stateDefaults.batchUpdates = batchUpdates;

	const [isSearching, setIsSearching] = useState(false);

	const onSearch = useCallback(
		(...args: any[]) => {
			action('search')(...args);
			setIsSearching(true);
			setTimeout(() => {
				setIsSearching(false);
			}, 1000);
		},
		[setIsSearching],
	);

	const onUpdate = useCallback((...args: any[]) => {
		action('update')(...args);
	}, []);

	const autocompleteProvider = useAutocompleteProvider(
		'storybook',
		getAutocompleteInitialData,
		getAutocompleteSuggestions,
	);

	const mockAnalyticsClient = {
		sendUIEvent: action('sendUIEvent'),
		sendOperationalEvent: action('sendOperationalEvent'),
		sendTrackEvent: action('sendTrackEvent'),
		sendScreenEvent: action('sendScreenEvent'),
	};

	const onSyntaxHelp = useCallback(() => {
		action('onSyntaxHelp');
		return false;
	}, []);

	return (
		<DiProvider use={deps}>
			<JQLEditorAnalyticsListener client={mockAnalyticsClient}>
				<Container>
					<LocaleProvider>
						<Editor
							analyticsSource={'storybook'}
							query={query}
							messages={messages}
							isSearching={isSearching}
							autocompleteProvider={autocompleteProvider}
							onEditorMounted={action('editorMounted')}
							onHydrate={onHydrate}
							onUpdate={onUpdate}
							onRenderError={action('renderError')}
							onDebugUnsafeMessage={action('onDebugUnsafeMessage')}
							onSearch={isSearch ? onSearch : undefined}
							isCompact={isCompact}
							enableRichInlineNodes={enableRichInlineNodes}
							onSyntaxHelp={onSyntaxHelp}
							defaultRows={defaultRows}
						/>
					</LocaleProvider>
				</Container>
			</JQLEditorAnalyticsListener>
		</DiProvider>
	);
};
