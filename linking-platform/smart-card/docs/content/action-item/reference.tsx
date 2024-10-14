import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`

### BaseActionItem Props

All action items inherit these props.
Named action such as \`EditAction\` or \`DeleteAction\` comes with the preset
icon and label. Thus only requires \`name\` and \`onClick\`.

${(
	<Props heading="" props={require('!!extract-react-types-loader!../../utils/props-action-item')} />
)}

### Named Actions with Data

These actions availability are based on the underlying link.
This means that they may not appear depending on what is available in the underlying
response. This also means that no underlying \`onClick\` is required in order to render these.

Current available named actions are \`PreviewAction\`, \`DownloadAction\`, \`CopyLinkAction\`, \`FollowAction\`,  and \`AutomationAction\`.

See [card actions](./card-actions) for more details.

`;
