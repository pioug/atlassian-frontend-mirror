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

The following actions change their behaviour based on the underlying link.
This means that they may not appear depending on what is available in the underlying
response. This also means that no underlying \`onClick\` is required in order to render these.

## PreviewAction
Depends on \`preview\` being available in the response. Upon clicking this, the card
will open a modal with the embed format.

## DownloadAction

Depends on \`atlassian:downloadUrl\` and a \`DownloadAction\` in \`schema:potentialAction\`
being available in the response. Upon clicking this, the user will download the given URL.

## ViewAction
Depends on a a \`ViewAction\` in \`schema:potentialAction\` being available in the response.
Upon clicking this, the use will navigate to the link in a new tab.
`;
