import React from 'react';
import {
	md,
	code,
	Example,
	Props,
	AtlassianInternalWarning,
	DevPreviewWarning,
} from '@atlaskit/docs';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const marginBottomStyles = xcss({
	marginBottom: 'space.100',
});

const marginTopStyles = xcss({
	marginBottom: 'space.100',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export default md`
${(
	<>
		<Box xcss={marginBottomStyles}>
			<AtlassianInternalWarning />
		</Box>
		<Box xcss={marginTopStyles}>
			<DevPreviewWarning />
		</Box>
	</>
)}

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
