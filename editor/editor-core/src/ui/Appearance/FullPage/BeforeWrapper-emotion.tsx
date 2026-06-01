/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `BeforeWrapper.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import type { ReactElement } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- intentional: emotion fallback; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

const beforePrimaryToolbarPluginWrapperStyles = css({
	display: 'flex',
	flexGrow: 1,
	justifyContent: 'flex-end',
	alignItems: 'center',
});

type ReactComponents = ReactElement | ReactElement[];

// Duplicate of the wrapper from `editor-plugins/before-primary-toolbar` used
// only in `FullPageToolbar` to decouple the plugin from the main toolbar
export const BeforePrimaryToolbarWrapperEmotion = (props: {
	beforePrimaryToolbarComponents: ReactComponents | undefined;
}): React.JSX.Element => (
	<div
		css={beforePrimaryToolbarPluginWrapperStyles}
		data-testid={'before-primary-toolbar-components-plugin'}
	>
		{props.beforePrimaryToolbarComponents}
	</div>
);
