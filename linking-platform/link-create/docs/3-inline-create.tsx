import React from 'react';

import { AtlassianInternalWarning, code, Example, md, Props } from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  As an alternative to the default modal experience link create can also be used inline via the exported \`<InlineCreate />\` component.

	This is great for use cases where you want to display link create alongside other content on the page or within a custom UI component (such as a drawer or dropdown).

  If you have any questions, you can reach out to [#help-fe-linking-platform](https://atlassian.slack.com/archives/CFKGAQZRV) for help.

  ## Installation

  ${code`yarn add @atlaskit/link-create`}

  ${(<Props heading="InlineCreate Props" props={require('!!extract-react-types-loader!../src/ui/inline-create')} />)}

  # Usage

  To start the experience, simply mount the \`<InlineCreate />\` component.

  Provide an \`onCreate\` callback to be notified of objects being created. When an object is created, this is not necessarily indication that the experience is completed/finished.

  To be notified of when the experience is completed provide an \`onComplete\` callback. By providing \`onComplete\` it enables link create to maintain control of the experience beyond the point of a single object creation (e.g. show a "Create and open" button in Confluence).

  You should also provide an \`onCancel\` callback to be notified when the user cancels the experience without completing an object. This may be useful if you have a different experience journey to follow depending on whether or not the user completed object creation or not.

	Note the component must be unmounted when the experience is completed, inline create does not have an implicit 'done' state.

	## Exit warning modal

	You must ensure the \`<InlineCreate />\` component is wrapped in a parent \`<LinkCreateExitWarningProvider />\` context provider, not doing so will result in an exception being thrown. This ensures that the user is warned if they attempt to navigate away from the form without completing the experience.

	Adopters can also trigger the exit warning by wrapping a custom callback with the utility function returned from the \`useWithExitWarning()\` hook. This is useful for scenarios where you want to trigger the exit warning from a custom button or link. The example below triggers the exit warning if the drawer is closed after the form has been changed.

  ## Examples

  ${(
		<Example
			packageName="@atlaskit/link-create"
			Component={require('../examples/05-inline-create').default}
			title="Inline create example"
			isDefaultSourceVisible
			source={require('!!raw-loader!../examples/05-inline-create')}
		/>
	)}
`;
