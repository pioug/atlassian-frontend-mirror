import React from 'react';

import { AtlassianInternalWarning, code, Example, md, Props } from '@atlaskit/docs';

const _default_1: any = md`
  ${(<AtlassianInternalWarning />)}

  The Link Create component is the driver component of meta creation flow. It allows users to create new links without having to leave their current context.

  If you have any questions, you can reach out to [#help-fe-linking-platform](https://atlassian.slack.com/archives/CFKGAQZRV) for help.

  ## Installation

  ${code`yarn add @atlaskit/link-create`}

  ${(<Props heading="LinkCreate Props" props={require('!!extract-react-types-loader!../src')} />)}

  # Usage

  To start the experience mount __LinkCreate__ and set active to \`true\`.

  Provide __onCreate__ to be notified of objects being created. When an object is created, this is not necessarily indication that the experience is completed/finished.

  To be notified of when the experience is completed provide __onComplete__. By providing __onComplete__ it enables link create to maintain control of the experience beyond the point of a single object creation (e.g. show a "Create and open" button in Confluence to edit newly created pages).

  You should also provide an __onCancel__ callback to be notified when the user cancels the experience without completing an object. This may be useful if you have a different experience journey to follow depending on whether or not the user completed object creation or not.

  When the experience is \`completed\` or \`cancelled\`, set active to \`false\` and the experience will transition off the screen before unmounting any visual components.

  Provide __onCloseComplete__ to be notified when the experience has been completely transitioned off screen and is safe for complete unmounting of the __LinkCreate__ component.


  ## Examples
  ### Basic Example

  ${(
		<Example
			packageName="@atlaskit/link-create"
			Component={require('../examples/00-basic').default}
			title="Example"
			isDefaultSourceVisible
			source={require('!!raw-loader!../examples/00-basic')}
		/>
	)}

  ### Link Picker integration Example
  ${(
		<Example
			packageName="@atlaskit/link-create"
			Component={require('../examples/03-create-link-picker').default}
			title="Link Picker Example"
			source={require('!!raw-loader!../examples/03-create-link-picker')}
		/>
	)}
`;
export default _default_1;
