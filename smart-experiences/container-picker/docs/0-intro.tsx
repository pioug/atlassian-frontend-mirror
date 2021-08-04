import React from 'react';
import {
  md,
  Example,
  Props,
  code,
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

  This is a container picker for jira projects and confluence spaces.

  ### EXPERIMENTAL
  The package is currently in beta stages.

  ## Usage
  ${code`import { SpacePicker, ProjectPicker } from '@atlaskit/container-picker';

  // Inside a react component with proper state and stuff.. :
  render() {
    return (
      <ProjectPicker

      />
    );
  }
  `}

  ${(
    <Example
      Component={require('../examples/0-JdogProjectPicker').default}
      title="Objects"
      source={require('!!raw-loader!../examples/0-JdogProjectPicker')}
    />
  )}

  ${(<Props props={require('!!extract-react-types-loader!../src/types')} />)}

`;
