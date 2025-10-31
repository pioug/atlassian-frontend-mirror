import React, { useCallback, useState } from 'react';

import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { DiProvider, type Injectable } from 'react-magnetic-di';
import { defaults as stateDefaults } from 'react-sweet-state';

import { useAutocompleteProvider } from '@atlaskit/jql-editor-autocomplete-rest';

import { JQLEditor, JQLEditorAnalyticsListener } from '../src';
import { type ExternalMessage } from '../src/state/types';

import { getAutocompleteInitialData, getAutocompleteSuggestions } from './autocomplete';
import { onHydrate } from './hydration';
import { LocaleProvider } from './locale-provider';
import { Container } from './styled';

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
	isSearch = true,
	isCompact = true,
	enableRichInlineNodes = true,
	batchUpdates = boolean('Batch updates', true),
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
							onSearch={boolean('Search button', isSearch) ? onSearch : undefined}
							isCompact={boolean('Compact', isCompact)}
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
