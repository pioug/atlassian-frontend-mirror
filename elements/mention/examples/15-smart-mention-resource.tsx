import React from 'react';

import { Editor, EditorContext, ToolbarHelp } from '@atlaskit/editor-core';
import { SmartMentionConfig, SmartMentionResource } from '../src';

const JDOG_CLOUD_ID = '49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5';

const BaseSmartMentionConfigOptions: SmartMentionConfig = {
  baseUrl: '',
  env: 'local',
  principalId: 'Context', // extract the accountId from the header
  productKey: 'people', // set your product scope
  searchQueryFilter: '', // set your Lucene-type query for the search
  siteId: JDOG_CLOUD_ID,
  includeTeams: false,
};

/**
 * Initialize the SmartMentionProvider somewhere near your App's root
 * by instantiating SmartMentionResource with the appropriate params.
 */
export const initSmartMentionProvider = () => {
  return new SmartMentionResource({
    ...BaseSmartMentionConfigOptions,
  });
};

const MentionEditor = () => {
  const resolvedSmartMentionProvider: SmartMentionResource = initSmartMentionProvider();

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
      />
    </EditorContext>
  );
};

export default MentionEditor;
