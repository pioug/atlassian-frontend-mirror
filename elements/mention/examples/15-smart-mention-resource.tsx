import React, { useMemo } from 'react';

import { Editor, EditorContext, ToolbarHelp } from '@atlaskit/editor-core';
import { doc, p, mention } from '@atlaskit/adf-utils/builders';
import { SmartMentionResource } from '../src';

const JDOG_CLOUD_ID = '49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5';

// Default document content for the editor example.
// 'text' deliberately not included in the mention() call below, so that
// the demo is clear that the mention name is resolved from API.
const adfDoc = doc(
  p(
    'Mention with name resolved from mentioned user ID using default name resolver: ',
    mention({ id: '655363:724d1c89-a70d-4153-9ee3-0415d514b5c6' }),
  ),
);

const MentionEditor = () => {
  /**
   * Initialize the SmartMentionProvider somewhere near your App's root
   * by instantiating SmartMentionResource with the appropriate params.
   * By default, existing mentions in your document are hydrated on load
   * using a default resolver, but you can override this by including a
   * `mentionNameResolver` field in the config passed to the constructor
   * of SmartMentionResource.
   */
  const resolvedSmartMentionProvider: SmartMentionResource = useMemo(
    () =>
      new SmartMentionResource({
        baseUrl: '',
        env: 'local',
        principalId: 'Context', // extract the accountId from the header
        productKey: 'people', // set your product scope
        searchQueryFilter: '', // set your Lucene-type query for the search
        siteId: JDOG_CLOUD_ID,
        includeTeams: false,
      }),
    [],
  );

  return (
    <EditorContext>
      <Editor
        appearance="comment"
        shouldFocus={true}
        disabled={false}
        mentionProvider={Promise.resolve(resolvedSmartMentionProvider)} // Plug in your Mentions provider
        allowPanel={true}
        primaryToolbarComponents={[
          <ToolbarHelp titlePosition="top" title="Help" key="help" />,
        ]}
        defaultValue={adfDoc}
      />
    </EditorContext>
  );
};

export default MentionEditor;
