import React from 'react';
import { md, code, Example, AtlassianInternalWarning } from '@atlaskit/docs';

import popup from './popup.png';

const CreateImage = (filename: string) => <img src={filename} />;

export default md`
  ${(<AtlassianInternalWarning />)}

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
    - [non-React based](#non-react-based):
      - [Popup (aka. MediaPicker)](#popup)
  - [Typescript](#typescript)
    - [AuthProvider Service Example](#authprovider)
  - [Popup Example](#example)

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

  There is also a non-React-based component called **Popup** (aka. MediaPicker) which provides a custom picker UI which supports the following sources:

  * Local file via native files browser
  * Local file via drag &amp; drop
  * GIPHY
  * Dropbox
  * Google Drive

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

  Pass it to the React component via the \`mediaClientConfig\` prop, or to the \`MediaPicker\` factory method when using the non-React **Popup** component.

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
  * **shouldCopyFileToRecents?**: \`boolean\` - whether or not the file(s) should appear in the clients recents collection

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

  It has some additional properties to the standard event properties on all the React components:

  * **isOpen?**: \`boolean\` - when true, the dialog will show when the component is first rendered _(NOTE: without this value, no dialog will appear unless you use the **onBrowserFn** hook)_
  * **onBrowserFn?**: \`(browse: () => void) => void\` - provides a callback to manually invoke the dialog. This can be useful for cases where the action is required outside of React render lifecycle
  * **onCancelFn?**: \`(cancel: (uniqueIdentifier: string) => void) => void\` - provides a callback which can be used to manually cancel an upload if required

  You can configure it with these options:

  * **multiple?**: \`boolean\` - whether or not to allow multiple files during selection
  * **fileExtensions?**: \`Array<string>\` - limit file types to given extensions

  Here's an example of using the component.

  **NOTE:**

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
/>`}

  <a name="non-react-based"></a>
  ### Non-React based

  <a name="popup"></a>
  ### Popup (aka. MediaPicker)

  The \`Popup\` component provides a custom UI which allows the user to select a file from multiple sources, both local and cloud.

  ${CreateImage(popup)}

  It has the following configuration properties, including the [base configuration properties](#component-config):

  * **container?**: \`HTMLElement\` - the DOM element to use as a container
  * **proxyReactContext?**: \`AppProxyReactContext\` - (advanced, not required on average) an object to use when needing React context from a different tree
  * **singleSelect?**: \`boolean\` - whether or not to allow multiple or just single selections

  Import the \`MediaPicker\` factory method and pass a \`MediaClientConfig\` object along with a custom configuration object to it. _NOTE: Since
  the class is code split (will load async on demand) you need to use the \`await\` keyword, or use a promise syntax._

  ${code`import { MediaPicker } from '@atlaskit/media-picker';

const mediaClientConfig = {
  authProvider: myAuthProviderFn
};

const popupConfig = {
  uploadParams: {
    collection: 'some-collection'
  }
};

// es6 using async/await...
const popup = await MediaPicker(mediaClientConfig, popupConfig);
doSomethingWith(popup);

// or es5 way with Promises...
MediaPicker(mediaClientConfig, popupConfig).then(popup => doSomethingWith(popup));`}

You'll then need to subscribe to its events. These events are the same as the React events described above in terms of functionality:

${code`popup.on('uploads-start', onUploadsStartFn);
popup.on('upload-preview-update', onUploadPreviewHandler);
popup.on('upload-end', onUploadEndHandler);
popup.on('upload-error', onUploadErrorHandler);
popup.on('closed', onClosedHandler);`}

The popup provides the following methods:

* **show(): Promise<void>** - open/show the picker UI
* **hide(): void** - hide/close the picker UI
* **cancel(uniqueIdentifier?: string | Promise<string>):  Promise<void>** - cancel all/specific uploads in progress
* **setUploadParams({ collection: string }): void** - provide upload parameters to specify collection
* **removeAllListeners(): void** - remove all listeners bound with .on()
* **emitClosed(): void** - remove all listeners bound with .on()
* **teardown(): void** - cleanup

  <a name="typescript"></a>
  ### Typescript

  MediaPicker is fully written in Typescript, and exports all its public types and interfaces.
  We refer to some of those objects in the docs, if you want to know more about those please have a look into:

  - [packages/media/media-picker/src/domain](https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/media/media-picker/src/domain/)
  - [packages/media/media-picker/src/popup/domain](https://bitbucket.org/atlassian/atlaskit-mk-2/src/master/packages/media/media-picker/src/popup/domain/)

  <a name="authprovider"></a>
  ### AuthProvider Service Example

  Media Picker requires a signed JWT for uploading files into the Media API.
  The token is usually created on the backend by your service with a function similar to this:

  ${code`function createFileStoreToken() {
  const tolerance = 60 * 1; // 1 minute
  const now = Math.floor(Date.now() / 1000) - tolerance;
  return jwt.sign(
    {
      access: {
        'urn:filestore:collection': ['create'],
        'urn:filestore:collection:test-collection': ['read', 'insert'],
        'urn:filestore:chunk:*': ['create', 'read'],
        'urn:filestore:upload': ['create'],
        'urn:filestore:upload:*': ['read', 'update'],
      },
      nbf: now,
      exp: now + 60 * 60, // 60 minutes
    },
    YOUR_SECRET,
    { issuer: YOUR_CLIENT_ID },
  );
}`}

  Please note, that you need access to the upload API filestore:upload to perform requests.

  <a name="example"></a>
  ### Popup Example

  ${(
    <Example
      Component={require('../examples/8-full-flow').default}
      title="Pop up"
      source={require('!!raw-loader!../examples/8-full-flow')}
    />
  )}
`;
