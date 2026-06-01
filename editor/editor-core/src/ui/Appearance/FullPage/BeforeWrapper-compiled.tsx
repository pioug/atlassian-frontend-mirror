/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `BeforeWrapper.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
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
export const BeforePrimaryToolbarWrapperCompiled = (props: {
	beforePrimaryToolbarComponents: ReactComponents | undefined;
}): React.JSX.Element => (
	<div
		css={styles.beforePrimaryToolbarPluginWrapper}
		data-testid={'before-primary-toolbar-components-plugin'}
	>
		{props.beforePrimaryToolbarComponents}
	</div>
);
