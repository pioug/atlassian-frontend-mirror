import React from 'react';

import { AtlassianInternalWarning, code, Example, md } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

This transformer allows encoding ProseMirror Node to Slack markdown.

  ## Usage

  Use the encoder with editor-slack-transformer as follows:

  ${code`import { SlackTransformer } from '@atlaskit/editor-slack-transformer';

  const serializer = new SlackTransformer();
  // To encode editor content as Slack markdown
  serializer.encode(editorContent);`}

  ${(
    <Example
      packageName="@atlaskit/editor-slack-transformer"
      Component={require('../examples/0-slack-markdown').default}
      title="ADF to Slack markdown"
      source={require('!!raw-loader!../examples/0-slack-markdown')}
    />
  )}
`;
