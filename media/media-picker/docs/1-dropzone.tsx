import React from 'react';
import { md } from '@atlaskit/docs';
import { DocsContentTabs } from '@atlaskit/media-test-helpers';
import dropZoneExamples from './content/dropzone/example';
import dropZoneProps from './content/dropzone/props';
const _default_1: any = md`

  ### Dropzone

  The \`Dropzone\` React component provides a drag &amp; drop solution for uploads.

  It has some additional properties to the standard event properties on all the React components:

  * **onDragEnter?**: \`(payload: DropzoneDragEnterEventPayload) => void\` - fired when a file is dragged over the drop zone
  * **onDragLeave?**: \`(payload: DropzoneDragLeaveEventPayload) => void\` - fired when a file is dragged away from the drop zone after entering
  * **onDrop?**: \`() => void\` - fired when a file is dropped on the drop zone
  * **onCancelFn?**: \`(cancel: (uniqueIdentifier: string) => void) => void\` - provides a callback which can be used to manually cancel an upload if required

  You can configure it with these options:

  * **container?**: HTMLElement - Container element for dropzone to render

  ${(
		<DocsContentTabs
			tabs={[
				{ name: 'Usage', content: dropZoneExamples },
				{ name: 'Props', content: dropZoneProps },
			]}
		/>
	)}

`;
export default _default_1;
