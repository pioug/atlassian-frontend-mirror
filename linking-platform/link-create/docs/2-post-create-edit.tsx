import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

const _default_1: any = md`
  # Post-Create Edit

  The post-create edit workflow provides plugins with the opportunity to allow users to edit the newly created object immediately after having created it.

  ## Supporting Edit

  For a plugin to support edit it needs to :
   - provide an edit render method via the plugin interface
   - use \`LinkCreateForm\` UI component in order for an \`Create + Edit\` submission button to be available (let us know if you have a use case for post-create edit but are not using \`LinkCreateForm\` and wish for an API to be exposed to trigger the edit workflow)

   ##### \`editView\`

   The \`editView\` field on the \`LinkCreatePlugin\` looks something like this:

${code`
export interface LinkCreatePlugin {
  // ... rest of fields ...
  /**
   * The post create edit view to be rendered after edit button is clicked.
   */
  editView?: ({ payload, onClose }: EditViewProps) => JSX.Element;
}
`}

  ### Example

${(
	<Example
		packageName="@atlaskit/link-create"
		Component={require('../examples/02-basic-with-edit').default}
		title="Example Plugin Supporting Edit"
		source={require('!!raw-loader!../examples/02-basic-with-edit')}
	/>
)}
`;
export default _default_1;
