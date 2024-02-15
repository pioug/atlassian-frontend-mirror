import React from 'react';

import { code, Example, md } from '@atlaskit/docs';

export default md`
  # Writing a Link Create Plugin

  ## What is a Plugin

  Link Create Plugins provide Link Create with the capability of being able to create different types of objects/entities.

  The \`LinkCreatePlugin\` interface specifies the structure and the key aspects that a plugin should follow to support a single new entity type.

  Plugins can be created in any fashion, but their final instances might be provided to a \`<LinkCreate />\` component something like this:

  ${code`
<LinkCreate plugins={[confluencePlugin, jiraPlugin]} />
  `}

  In practice, plugins often will need some configuration, so it might look more like:

  ${code`
<LinkCreate plugins={[createConfluencePlugin(confluenceConfig), createJiraPlugin(jiraConfig)]} />
`}

  ## Creating a plugin (the interface)

  To create a plugin, you need to implement the following properties:

  ${code`
export interface LinkCreatePlugin {
  /**
   * A unique key for the plugin entity
   */
  key: string;

  /**
   * A renderer function to render the form
   */
  form: ReactNode;

  /**
   * A label to display for the plugin entity
   */
  label: string;

  /**
   * An icon to display for the plugin entity
   */
  icon: string;

  /**
   * The Group that this plugin entity belongs to
   */
  group: Group;
}`}

  #### \`key\`

  This should be a string that uniquely represents and identifies the plugin (and by extension the object type being created).

  This can be any value, so you may want to make it distinctly identifiable as your implmentation of the object type to avoid collisions with other plugins.

  The \`key\` is used internally, but also to help makers set and control what is the active plugin used by Link Create when it is active, for example activating Link Create with the Confluence Page object type might look like this:

  ${code`
<LinkCreate active entityKey="confluence-page" />
`}


  #### \`form\`

  This is the core UI that your plugin implements that facilitates the creation of your new object type.

  This UI will be displayed inside a modal when Link Create is activated.

  Link Create may take many shapes and forms in the future and not always be displayed in a modal window (eg, inline on a page, or inside a popup) so you should make an effort to make the UI as responsive as possible.

  We provide some utility hooks and components for your plugin UI to communicate and implement object creation as smoothly as possible (described below) such as:
  - \`useLinkCreateCallback()\` hook which allows your plugin to communicate when your user has successfully created an object
  - \`<LinkCreateForm />\` component which simplifies object creation forms, used in tangent with "connected" form field components including \`TextField\`, \`AsyncSelect\` etc


  ### Presentational Properties (Label + Icon + Group)

  These fields assist with presenting and organising the display of object creation types in the user interface.

  At the time of writing these properties are not actively used yet, but you should provide them so that we can make use of them in future.

  #### \`label\`
  This is the label that will be displayed for the plugin entity in the user interface. It should be descriptive and succinct enough to let users understand the function of the plugin. It should encapsulate enough about the object being created that a user can understand what object is being created without needing any additional context (eg. "Confluence page").

  #### \`icon\`
  Should be a URL that can be provided as an icon that should be representative of the specific object type the plugin creates.

  #### \`group\`

  Helps in categorizing and organizing the plugins according to their functionality or usage (typically the product — eg Confluence).

  The group property is an object that should have:
    1. \`label\` and \`icon\` fields that represents the group the object belongs to in the same way as label and icon above describe the object type, and a
    2. \`key\` field that uniquely represents the group the plugin is being associated with.


  ## Link Create Plugin Control/Communication

  ### Callbacks Provider

  The callbacks provider is the core interface that allows plugins to communicate to Link Create.

  At the time of writing it provides three actions to perform to communicate to link create:

  - creation (\`onCreate\`)
  - cancellation (\`onCancel\`)
  - error (\`onFailure\`)

  These are accessed via React context using the \`useLinkCreateCallback\` hook

  ${code`
const { onCreate, onFailure, onCancel } = useLinkCreateCallback()
`}

  #### \`onCreate\`

  This callback should be called with the newly created object once the user has successfully created it.

${code`
export type CreatePayload = {
  url: string;
  objectId: string;
  objectType: string;
  ari?: string | undefined;
  data?: Record<string, unknown>;
};`}

  At a minimum, a plugin must provide for the object:
  - the \`url\` that links to the created object
  - the \`objectId\` uniquely identifing the created object that can be persisted and referenced for usage in API's
  - the \`objectType\` that describes the object being created (for analytics purposes)

  These required fields are core to the usefulness of Link Create.

  Plugins can optionally provide an \`ari\` field, and an arbitrary \`data\` field if there may be additional information that might be useful for bespoke use cases.

  #### \`onFailure\`

  If anything goes wrong during object creation that is not expected (true exceptions / unhandleable), you can notify the Link Create in order for it to fire standard failure events for monitoring purposes of experience quality.

  You can still fire your own error events in addition to this though.

  The \`onFailure\` callback is however not used to display any error messages to the user and is purely for observability of experience health, your plugin will need to handle showing error messages in its user interface.

  In practice using \`onCreate\` and \`onFailure\` together create the foundations of a simple plugin.

  ${code`
const Form = () => {
  const { onCreate, onFailure } = useLinkCreateCallback()

  return (
    <MyPluginFormUI onSubmit={
      async data => {
        try {
          const createdObject = await createObject(data)
          await onCreate(createdObject)
        } catch(err) {
          onFailure(err)
        }
      } />
  )
}

const MyPlugin = {
  key: 'my-plugin',
  label: 'My Cool Object',
  icon: 'my-icon',
  group: {
    label: 'Acme',
    icon: 'acme-icon',
    key: 'acme'
  }
  form: <Form />
}
`}

  #### \`onCancel\`

  The \`onCancel\` callback provides plugins the affordance to implement their own cancel button. When calling the \`onCancel\` callback a plugin is signalling to \`LinkCreate\` the user intention to exit the experience.

  Without this users can only exit or cancel the experience by clicking outside of the modal, but you may want to provide your own cancellation button.

  This is as simple calling in a button \`onClick\` handler.

  ${code`
const CancelButton = () => {
  const { onCancel } = useLinkCreateCallback();

  return <button onClick={onCancel}>Cancel</button>
}
`}

  ## Link CreateForm UI

  The \`<CreateForm />\` component is a batteries-included "Link Create-connected" form that is designed to make implementing the object creation flow simpler and more consistent for plugins.

  The component is designed to be composed with our connected form field components that simplify state management and improve UI consistency:
  - \`TextField\`
  - \`Select\`
  - \`AsyncSelect\`

  The primary props for the \`CreateForm\` are:

  ${code`
export interface CreateFormProps<FormData> {
  /**
   * Should resolve to void, or resolve to an object of
   * keys (field names) with error messages (key values)
   */
  onSubmit: (
    data: OmitReservedFields<FormData>,
  ) => void | Errors | Promise<void | Errors>;
  /**
   * Children to render in the form (form fields)
   */
  children: ReactNode;
}`}

  Implementing a basic plugin create form might look something like this:

${(
  <Example
    packageName="@atlaskit/link-create"
    Component={require('../examples/00-basic').default}
    title="Example Plugin"
    source={require('!!raw-loader!../examples/00-basic')}
  />
)}

  By using the \`CreateForm\` the UI gets the following features for free:
  - form state management
  - form footer with a submit and cancellation button connected to the form state

  It also provides support for these features which do not otherwise have an API exposed for plugins to activate:
  - exit-warning when a user attempts to cancel the creation flow with present changes
  - [post-create edit workflow](./post-create-edit) that allows users to edit the newly created object after they have created it
`;
