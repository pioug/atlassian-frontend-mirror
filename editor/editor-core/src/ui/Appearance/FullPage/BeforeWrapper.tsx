/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactElement } from 'react';

import { cssMap, jsx } from '@compiled/react';

const styles = cssMap({
	beforePrimaryToolbarPluginWrapper: {
		display: 'flex',
		flexGrow: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
});

type ReactComponents = ReactElement | ReactElement[];

// Duplicate of the wrapper from `editor-plugins/before-primary-toolbar` used
// only in `FullPageToolbar` to decouple the plugin from the main toolbar
export const BeforePrimaryToolbarWrapper = (props: {
	beforePrimaryToolbarComponents: ReactComponents | undefined;
}): React.JSX.Element => (
	<div
		css={styles.beforePrimaryToolbarPluginWrapper}
		data-testid={'before-primary-toolbar-components-plugin'}
	>
		{props.beforePrimaryToolbarComponents}
	</div>
);
