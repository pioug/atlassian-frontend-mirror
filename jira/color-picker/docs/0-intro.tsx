import React from 'react';
import {
  md,
  code,
  Example,
  Props,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';
import { Box, xcss } from '@atlaskit/primitives';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

const marginBottomStyles = xcss({
  marginBottom: 'space.100',
});

const marginTopStyles = xcss({
  marginBottom: 'space.100',
});

export default md`
${
  getBooleanFF(
    'platform.design-tokens-color-picker-portfolio-plan-wizard_w8rcl',
  ) ? (
    <>
      <Box xcss={marginBottomStyles}>
        <AtlassianInternalWarning />
      </Box>
      <Box xcss={marginTopStyles}>
        <DevPreviewWarning />
      </Box>
    </>
  ) : (
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <DevPreviewWarning />
      </div>
    </>
  )
}

This component allows to pick colors from color palette.

## Usage

${code`
  import ColorPicker from '@atlaskit/color-picker';
`}

${(
  <Example
    packageName="@atlaskit/color-picker"
    Component={require('../examples/00-color-picker').default}
    source={require('!!raw-loader!../examples/00-color-picker')}
    title="Basic Usage"
    language="jsx"
  />
)}

${(
  <Example
    packageName="@atlaskit/color-picker"
    Component={require('../examples/01-multi-columns-color-picker').default}
    source={require('!!raw-loader!../examples/01-multi-columns-color-picker')}
    title="Color picker with multiple columns palette"
    language="jsx"
  />
)}

${(
  <Props
    heading="Color picker props"
    props={require('!!extract-react-types-loader!../src/components/ColorPicker')}
  />
)}
`;
