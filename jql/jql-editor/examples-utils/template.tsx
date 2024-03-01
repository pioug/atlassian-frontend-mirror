import React, { useCallback, useState } from 'react';

import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { Dependency, DiProvider } from 'react-magnetic-di';
import { defaults as stateDefaults } from 'react-sweet-state';

import { useAutocompleteProvider } from '@atlaskit/jql-editor-autocomplete-rest';

import { JQLEditor, JQLEditorAnalyticsListener } from '../src';
import { ExternalMessage } from '../src/state/types';

import {
  getAutocompleteInitialData,
  getAutocompleteSuggestions,
} from './autocomplete';
import { onHydrate } from './hydration';
import { LocaleProvider } from './locale-provider';
import { Container } from './styled';

export type TemplateArgs = {
  query: string;
  messages?: ExternalMessage[];
  isSearch?: boolean;
  isCompact?: boolean;
  enableRichInlineNodes?: boolean;
  batchUpdates?: boolean;
  Editor?: typeof JQLEditor;
  deps?: Dependency[];
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
              onSearch={
                boolean('Search button', isSearch) ? onSearch : undefined
              }
              isCompact={boolean('Compact', isCompact)}
              enableRichInlineNodes={enableRichInlineNodes}
              onSyntaxHelp={onSyntaxHelp}
            />
          </LocaleProvider>
        </Container>
      </JQLEditorAnalyticsListener>
    </DiProvider>
  );
};
