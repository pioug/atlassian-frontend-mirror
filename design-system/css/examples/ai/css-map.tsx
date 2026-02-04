/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'inline-block',
// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
		paddingTop: token('space.100'),
// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
		paddingRight: token('space.100'),
// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
		paddingBottom: token('space.100'),
// eslint-disable-next-line @atlaskit/design-system/no-physical-properties
		paddingLeft: token('space.100'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-invalid-css-map
const _default_1: JSX.Element[] = [
    <div css={styles.container}>Container contents</div>,
    <Box xcss={styles.container}>Container contents</Box>,
];
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-invalid-css-map
export default _default_1;
