import React, { useEffect, useRef } from 'react';

import { injectIntl, type IntlShape } from 'react-intl-next';
import { di } from 'react-magnetic-di';

import { useJqlEditorAnalytics } from '../../analytics';
import {
  EditorThemeContext,
  useEditorTheme,
} from '../../hooks/use-editor-theme';
import { EditorStateContainer } from '../../state';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { JQLEditorPortalRenderer } from '../jql-editor-portal-provider';
// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import JQLEditorView from '../jql-editor-view';

import { type JQLEditorUIProps } from './types';

export type JQLEditorInnerProps = JQLEditorUIProps & {
  /**
   * React-intl object.
   */
  intl: IntlShape;
};

const JQLEditorInner = ({
  analyticsSource,
  query,
  messages = [],
  inputRef,
  isSearching,
  onEditorMounted,
  onDebugUnsafeMessage,
  onHydrate,
  onUpdate,
  onSearch,
  autocompleteProvider,
  intl,
  enableRichInlineNodes = false,
  isCompact,
  onSyntaxHelp,
  onFocus,
}: JQLEditorInnerProps) => {
  di(JQLEditorView);

  const editorTheme = useEditorTheme({ isSearch: !!onSearch, isCompact });
  const { createAndFireAnalyticsEvent } =
    useJqlEditorAnalytics(analyticsSource);

  // Create and update a mutable ref for our intl object so it can be used by Prosemirror plugins.
  const intlRef = useRef(intl);
  useEffect(() => {
    intlRef.current = intl;
  }, [intl]);

  return (
    <EditorStateContainer
      query={query}
      externalMessages={messages}
      isSearching={isSearching}
      intlRef={intlRef}
      onEditorMounted={onEditorMounted}
      onDebugUnsafeMessage={onDebugUnsafeMessage}
      onHydrate={onHydrate}
      onUpdate={onUpdate}
      onSearch={onSearch}
      createAndFireAnalyticsEvent={createAndFireAnalyticsEvent}
      autocompleteProvider={autocompleteProvider}
      enableRichInlineNodes={enableRichInlineNodes}
      onSyntaxHelp={onSyntaxHelp}
      onFocus={onFocus}
    >
      <EditorThemeContext.Provider value={editorTheme}>
        <JQLEditorPortalRenderer>
          <JQLEditorView inputRef={inputRef} />
        </JQLEditorPortalRenderer>
      </EditorThemeContext.Provider>
    </EditorStateContainer>
  );
};

export default injectIntl<'intl', JQLEditorInnerProps>(JQLEditorInner);
