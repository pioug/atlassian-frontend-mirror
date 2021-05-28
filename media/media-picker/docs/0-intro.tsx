import React from 'react';
import { md, code, Example, AtlassianInternalWarning } from '@atlaskit/docs';
import { createRxjsNotice } from '@atlaskit/media-common/docs';

import popupWarning from '../example-helpers/popup-warning';

export default md`
  ${(<AtlassianInternalWarning />)}

  ${popupWarning}

  ${createRxjsNotice('Media Picker')}

  # Documentation

  ## Table of contents
  - [Installing @atlaskit/media-picker](#install-media-picker)
  - [Media Picker Component Overview](#media-picker-overview)
  - [Configuring](#configuring)
    - [MediaClientConfig](#media-client-config)
    - [AuthProvider](#auth-provider)
    - [Component-specific Config](#component-config)
  - [Working with the Components](#working-with-components)
    - [React based](#react-based):
      - [Dropzone](#dropzone)
      - [Clipboard](#clipboard)
      - [Browser](#browser)

  ### Note:

  Don't forget to add these polyfills to your product build if you're using emoji or mentions in the editor and you want to target older browsers:

  * \`ChildNode.remove()\` ([polyfill](https://www.npmjs.com/package/element-remove), [browser support](https://caniuse.com/#feat=childnode-remove))

  <a name="install-media-picker"></a>
  ## Installing @atlaskit/media-picker

${code`
  yarn add @atlaskit/media-picker
`}

  <a name="media-picker-overview"></a>
  ## Media Picker Component Overview

  The MediaPicker library is made up of several components which allow the user to select media in different ways.

  The following components are React-based:

  * **Browser** - provides the native file browser to allow the user to select a local file
  * **DropZone** - provides a drag &amp; drop area for the user to drag &amp; drop a local file
  * **Clipboard** - provides copy and paste support for the user

  There is also a non-React-based component called MediaPicker which provides a custom picker UI which supports the following sources:

  * Local file via native files browser

  <a name="configuring"></a>
  ## Configuring

  MediaPicker components require several configuration details to work correctly. They are described below.

  <a name="media-client-config"></a>
  ### MediaClientConfig

  No matter which component you use, you'll need to create a \`MediaClientConfig\` object and pass it to the component via the **mediaClientConfig** prop. This should be
  done at/by the product level, so that a common config can be passed down to the components.

  \`MediaClientConfig\` must contain a property **authProvider** of function type \`AuthProvider\` (explained in more detail below). This enables
  the component to communicate correctly with the Media Services backend API by passing tokens.

  ${code`const mediaClientConfig = {
  authProvider: myAuthProviderFn
};`}

  Pass it to the React component via the \`mediaClientConfig\` prop.

  <a name="auth-provider"></a>
  ### AuthProvider

  The **authProvider** value of the \`MediaClientConfig\` object is a function which returns a Promise which resolves to a type \`Auth\`. The function is passed a single argument of type \`AuthContext\`
  which contains a **collectionName** string property. This can be used to pass to your auth provider for additional context (ie. which collection you need to access).

  \`AuthProvider\` type can be described as:

  ${code`function(context?: AuthContext): Promise<Auth>`}

  The \`AuthProvider\` can support client-based auth (you provide the auth service) or ASAP-based auth (Atlassian provides it).

  ${code`interface ClientBasedAuth {
  clientId: string;
  token: string;
  baseUrl: string;
}

export interface AsapBasedAuth {
  asapIssuer: string;
  token: string;
  baseUrl: string;
}

type Auth = ClientBasedAuth | AsapBasedAuth;

interface AuthContext {
  collectionName?: string;
}

// The signature for an AuthProvider function...
type AuthProvider = (context?: AuthContext) => Promise<Auth>;`}

  You might write something like this as your \`AuthProvider\`.

  ${code`const myAuthProviderFn = (context: AuthContext) => {
  /// the response should be of type Auth...
  return fetch("https://get-auth?collection=" + context.collectionName);
}`}

  <a name="component-config"></a>
  ### Component Configuration

  Apart from requiring a \`MediaClientConfig\` with an \`AuthProvider\`, each component can be configured for additional component-specific settings.

  These are the base properties for each component configuration, meaning each component can be configured with these common properties:

  * **uploadParams?**: \`object\` - an object containing the following properties:
    * **collection?**: \`string\` - the collection name to upload file(s) to

  There are additional config properties available for each component, they are described with each component below.

  <a name="working-with-components"></a>
  ### Working with the Components

  <a name="react-based"></a>
  #### React based:

  The React components are imported from the library as needed.

  ${code`import { Dropzone, Clipboard, Browse } from '@atlaskit/media-picker'`}

  You would then wrap these components in another component and render them as part of that components render logic.

  Each React component has the following standard props, which allow you to receive events about the uploads.

  * **onUploadStart?**: \`(payload: UploadsStartEventPayload) => void\` - This event is fired when files begin to upload
  * **onPreviewUpdate?**: \`(payload: UploadPreviewUpdateEventPayload) => void\` - This event is fired when a preview (image) of the files uploaded is available
  * **onError?**: \`(payload: UploadErrorEventPayload) => void\` - This event is fired when errors occur during upload
  * **onEnd?**: \`(payload: UploadEndEventPayload) => void\` - This event is fired when the upload ends

  The following sections describe how to work with the React components. _It is assumed you would have already created a \`MediaClientConfig\` with \`AuthProvider\` as described above._

  <a name="dropzone"></a>
  ### Dropzone

  The \`Dropzone\` React component provides a drag &amp; drop solution for uploads.

  It has some additional properties to the standard event properties on all the React components:

  * **onDragEnter?**: \`(payload: DropzoneDragEnterEventPayload) => void\` - fired when a file is dragged over the drop zone
  * **onDragLeave?**: \`(payload: DropzoneDragLeaveEventPayload) => void\` - fired when a file is dragged away from the drop zone after entering
  * **onDrop?**: \`() => void\` - fired when a file is dropped on the drop zone
  * **onCancelFn?**: \`(cancel: (uniqueIdentifier: string) => void) => void\` - provides a callback which can be used to manually cancel an upload if required

  You can configure it with these options:

  * **container?**: HTMLElement - Container element for dropzone to render

  Here's an example of using the component.

  **NOTE:**

  * To cancel the upload take a look at the \`onCancelFn\` prop. You are passed a ref to a function which you can call later by passing an upload id you received before.

  ${code`import { Dropzone } from '@atlaskit/media-picker';

const mediaClientConfig = {
  authProvider: myAuthProviderFn
};

const dropZoneConfig = {
  container: document.getElementById('dropZone'),
  uploadParams: {
    collection: 'some-collection',
  }
}`}

  Here's an example of using the component.

  **NOTE:**

  * To cancel the upload take a look at the \`onCancelFn\` prop. You are passed a ref to a function which you can call later by passing an upload id you received before.

  ${code`function onCancelFn(cancelFn) {
    // do something with cancelFn when needed...
    setTimeout(() => cancelFn('some-upload-id'), 1000)
  }

<Dropzone
  mediaClientConfig={mediaClientConfig}
  config={dropZoneConfig}
  onDragEnter={onDragEnterFn}
  onDragLeave={onDragLeaveFn}
  onDrop={onDropFn}
  onCancelFn={onCancelFn}
  onUploadsStart={onUploadsStartFn}
  onPreviewUpdate={onPreviewUpdateFn}
  onError={onErrorHandler}
  onEnd={onEndHandler}
/>`}

  <a name="clipboard"></a>
  ### Clipboard

  The \`Clipboard\` React component provides copy &amp; paste capabilities. This allows the user to paste copied files into the browser.

  _It does not have any additional configuration beyond the base configuration options available._

  Here's an example of using the component.

  ${code`import { Clipboard } from '@atlaskit/media-picker';

  const mediaClientConfig = {
    authProvider: myAuthProviderFn
  };

  const clipboardConfig = {
    uploadParams: {
      collection: 'some-collection',
    }
  }
}`}

Here's an example of using the component.

${code`<Clipboard
  mediaClientConfig={mediaClientConfig}
  config={clipboardConfig}
  onUploadsStart={onUploadsStartFn}
  onPreviewUpdate={onPreviewUpdateFn}
  onError={onErrorHandler}
  onEnd={onEndHandler}
/>`}

  <a name="browser"></a>
  ### Browser

  The \`Browser\` React component enables the user to select local files via the native browser file dialog.

  There is two ways of integrating the component:

  * You can pass a children factory in a shape of \`(browse) => React.ReactChild\` function as in the example below:

  ${(
    <Example
      Component={require('../examples/3-browse-with-children').default}
      title="Browser with children factory"
      source={require('!!raw-loader!../examples/3-browse-with-children')}
    />
  )}

  * Or by using one of control props
    - **isOpen?**: \`boolean\` - when true, the dialog will show when the component is first rendered _(NOTE: without this value, no dialog will appear unless you use the **onBrowserFn** hook)_
    - **onBrowserFn?**: \`(browse: () => void) => void\` - provides a callback to manually invoke the dialog. This can be useful for cases where the action is required outside of React render lifecycle

  To cancel an upload provide the following prop:

  * **onCancelFn?**: \`(cancel: (uniqueIdentifier: string) => void) => void\` - provides a callback which can be used to manually cancel an upload if required

  Additionally you can configure it with these options:

  * **multiple?**: \`boolean\` - whether or not to allow multiple files during selection
  * **fileExtensions?**: \`Array<string>\` - limit file types to given extensions
  * **replaceFileId?**: \`string\` - a fileId to use instead of the default behaviour which is to create one for you. If the file exists it will be replaced, otherwise it will be created first time.

  Here's an example of using the component.

  **NOTE:**

  * Passing \`replaceFileId\` forces the input element to only accept a single file, multiple uploads are not possible.
  * To cancel the upload take a look at the \`onCancelFn\` prop. You are passed a ref to a function which you can call later by passing an upload id you received before.
  * If you want to render the component without showing the native dialog immediately, you can use the \`onBrowseFn\` prop to receive a function which can be called later.

  ${code`import { Clipboard } from '@atlaskit/media-picker';

const mediaClientConfig = {
  authProvider: myAuthProviderFn
};

const browserConfig = {
  multiple: true,
  fileExtensions: ['image/jpeg', 'image/png', 'video/mp4'],
  uploadParams: {
    collection: 'some-collection',
  },
};`}

${code`function onCancelFn(cancelFn) {
  // cancel known upload with cancelFn when needed...
  setTimeout(() => cancelFn('some-upload-id'), 1000)
}

function onBrowseFnHandler(browseFn) {
  // show native browser dialog with browseFn when needed...
  setTimeout(() => browseFn(), 1000)
}

<Browser
  mediaClientConfig={mediaClientConfig}
  config={browserConfig}
  isOpen={true}
  onBrowseFn={onBrowseFnHandler}
  onCancelFn={onCancelFn}
  onUploadsStart={onUploadsStartFn}
  onPreviewUpdate={onPreviewUpdateFn}
  onError={onErrorHandler}
  onEnd={onEndHandler}
/>`}`;
