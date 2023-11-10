import React from 'react';

import {
  AtlassianInternalWarning,
  code,
  Example,
  md,
  Props,
} from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

  The Link Create component is the driver component of meta creation flow. It allows users to create new links without having to leave their current context.

  If you have any questions, you can reach out to [#help-linking-platform](https://atlassian.slack.com/archives/CFKGAQZRV) for help.

  ## Installation

  ${code`yarn add @atlaskit/link-create`}

  ## Usage

  ${code`
  import { LinkCreate, CreatePayload } from '@atlaskit/link-create';

  ...
  // Inside a component with proper state and event management
  const handleCreate = (payload: CreatePayload) => {...}

  const handleComplete = () => {...}

  const handleCancel = () => {...}

  const handleFailure = () => {...}

  return (
    <LinkCreate
      entityKey={"entityKey"}
      plugins={...}
      onCreate={handleCreate}
      onComplete={handleComplete}
      onFailure={handleFailure}
      onCancel={handleCancel}
      {...}
    />
  )
`}

  ${(
    <Props
      heading="LinkCreate Props"
      props={require('!!extract-react-types-loader!../src')}
    />
  )}

  ## Plugins
  Plugins provide functionality to Link Create. Currently, plugins give Link Create the required UX to enable a meta flow to create Objects without leaving the context from which it was originally triggered.


  ${code`
  import { LinkCreate } from '@atlaskit/link-create';
  import { createPlugin } from '@atlaskit/link-create...';

  ...
  // Inside a component with proper state and event management
  const createPlugins = [createPlugin(...)];

  return (
    <LinkCreate
      entityKey={"entityKey"}
      plugins={createPlugins}
      {...}
    />
  )
`}

  ## Active
  The current mechanism to display Link Create is within the modal component.

  The \`active\` prop controls when the modal is shown. Additionally, we expose two Modal events:  \`onOpenComplete\` and \`onCloseComplete\`. We also provide a custom \`modalTitle\` prop that overrides the default __Create new__ title.

  ${code`
  import { LinkCreate } from '@atlaskit/link-create';

  ...
  // Inside a component with proper state and event management
  const handleComplete = () => {
    ...
    setActive(false);
  }

  const handleCloseComplete = () => {...}

  const handleOpenComplete = () => {...}

  return (
    <LinkCreate
      active={active}
      entityKey={"entityKey"}
      plugins={...}
      onComplete={handleComplete}
      onOpenComplete={handleOpenComplete}
      onCloseComplete={handleCloseComplete}
      {...}
    />
  )
`}


  ## Examples
  ### Basic Example

  ${(
    <Example
      packageName="@atlaskit/link-create"
      Component={require('../examples/00-basic').default}
      title="Example"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ### Link Picker Example
  ${(
    <Example
      packageName="@atlaskit/link-create"
      Component={require('../examples/03-create-link-picker').default}
      title="Link Picker Example"
      source={require('!!raw-loader!../examples/03-create-link-picker')}
    />
  )}
`;
