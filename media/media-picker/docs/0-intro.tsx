import React from 'react';
import { md, AtlassianInternalWarning } from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  ### Note:

  Don't forget to add these polyfills to your product build if you're using emoji or mentions in the editor and you want to target older browsers:

  * \`ChildNode.remove()\` ([polyfill](https://www.npmjs.com/package/element-remove), [browser support](https://caniuse.com/#feat=childnode-remove))

  ## Media Picker Component Overview

  The MediaPicker library is made up of several components which allow the user to select media in different ways.

  The following components are React-based:

  * [DropZone](./media-picker/docs/dropzone) - provides a drag &amp; drop area for the user to drag &amp; drop a local file
  * [Clipboard](./media-picker/docs/clipboard) - provides copy and paste support for the user
  * [Browser](./media-picker/docs/browser) - provides the native file browser to allow the user to select a local file

  Each React component has the following standard props, which allow you to receive events about the uploads.

  * **onUploadStart?**: \`(payload: UploadsStartEventPayload) => void\` - This event is fired when files begin to upload
  * **onPreviewUpdate?**: \`(payload: UploadPreviewUpdateEventPayload) => void\` - This event is fired when a preview (image) of the files uploaded is available
  * **onError?**: \`(payload: UploadErrorEventPayload) => void\` - This event is fired when errors occur during upload
  * **onEnd?**: \`(payload: UploadEndEventPayload) => void\` - This event is fired when the upload ends

  There is also a non-React-based component called MediaPicker which provides a custom picker UI which supports the following sources:

  * Local file via native files browser

  ### Note:

We assume you have a valid \`mediaClientConfig\` and \`authProvider\` object setup as per [this](https://developer.atlassian.com/platform/media/getting-started/configure-media-client/).
For the sake of brewity, most of the example uses inbuilt helper methods.

`;
