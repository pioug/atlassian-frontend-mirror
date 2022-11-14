import React from 'react';
import {
  md,
  Example,
  Props,
  code,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <>
      <SectionMessage
        title="This package is deprecated and will be supported until 20/11/2022."
        appearance="error"
      >
        <p>
          There is no alternative package; consider creating your own
          @atlaskit/select wrapper that calls Collaboration Graph.
        </p>
      </SectionMessage>
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
      Component={require('../examples/0-PickerExample').default}
      title="Objects"
      source={require('!!raw-loader!../examples/0-PickerExample')}
    />
  )}

  ${(<Props props={require('!!extract-react-types-loader!../src/types')} />)}

`;
