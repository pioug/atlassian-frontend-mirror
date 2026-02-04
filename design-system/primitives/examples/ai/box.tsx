/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	box: {
// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
		paddingTop: token('space.200'),
// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
		paddingRight: token('space.200'),
// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
		paddingBottom: token('space.200'),
// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
		paddingLeft: token('space.200'),
		backgroundColor: token('color.background.neutral.subtle'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-invalid-css-map
const _default_1: JSX.Element[] = [
    <Box padding="space.200" backgroundColor="color.background.neutral.subtle">
        Basic box
    </Box>,
    <Box xcss={styles.box}>Styled box</Box>,
];
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-invalid-css-map
export default _default_1;
