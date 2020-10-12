import React from 'react';
import {
  code,
  md,
  Example,
  Props,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';

export default md`
  ${(
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <DevPreviewWarning />
      </div>
    </>
  )}

  This package provides the view components required to assemble the "Right to be forgotten" drawers.

  ## Usage

  By providing the building blocks rather than a single complete solution, a simpler and more flexible API can be provided for adjustments, customizations and data-routing.

  Start by rendering a FocusedTaskCloseAccount then provide it the necessary screens, plugging in data providing callbacks where necessary.

  For example, to assemble the "Delete user" flow, provide the DeleteUserOverviewScreen and DeleteUserContentPreviewScreen.

  ${code`
import {
  FocusedTaskCloseAccount,
  DeleteUserOverviewScreen,
  DeleteUserContentPreviewScreen,
  DeactivateUserOverviewScreen,
} from '@atlaskit/focused-task-close-account';
  `}

  ${(
    <Example
      packageName="@atlaskit/focused-task-close-account"
      title="Basic drawer assembly"
      Component={require('../examples/00-BasicDrawerAssembly').default}
      source={require('!!raw-loader!../examples/00-BasicDrawerAssembly')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/focused-task-close-account"
      title="Delete user drawer"
      Component={require('../examples/01-DeleteUserDrawer').default}
      source={require('!!raw-loader!../examples/01-DeleteUserDrawer')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/focused-task-close-account"
      title="Single screen drawer"
      Component={require('../examples/02-SingleScreenDrawer').default}
      source={require('!!raw-loader!../examples/02-SingleScreenDrawer')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/focused-task-close-account"
      title="Deactivate drawer"
      Component={require('../examples/03-DeactivateDrawer').default}
      source={require('!!raw-loader!../examples/03-DeactivateDrawer')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/FocusedTaskCloseAccount')}
    />
  )}

`;
