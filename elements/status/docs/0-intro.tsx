import React from 'react';
import {
  md,
  Example,
  Props,
  code,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

import StatusExample from '../examples/00-simple-status';
const StatusSource = require('!!raw-loader!../examples/00-simple-status');
import StatusPickerExample from '../examples/01-status-picker';
const StatusPickerSource = require('!!raw-loader!../examples/01-status-picker');

const StatusPickerProps = require('!!extract-react-types-loader!../src/components/StatusPicker');

export default md`
${(<AtlassianInternalWarning />)}

This component is the implementation of the Status element in React.

## Usage
  ### Status
  ${code`import { Status, Color } from '@atlaskit/status';`}

  ${(
    <Example
      packageName="@atlaskit/status"
      Component={StatusExample}
      title="Status"
      source={StatusSource}
    />
  )}

  ### Status Picker

  ${code`import { StatusPicker } from '@atlaskit/status';`}



  ${(
    <Example
      packageName="@atlaskit/status"
      Component={StatusPickerExample}
      title="Status Picker"
      source={StatusPickerSource}
    />
  )}

  ${(<Props heading="StatusPicker Props" props={StatusPickerProps} />)}
`;

// TODO: Add Props for Status when pretty prop types support function.
