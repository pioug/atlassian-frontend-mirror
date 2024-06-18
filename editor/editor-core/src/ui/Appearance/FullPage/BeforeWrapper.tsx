/** @jsx jsx */
import type { ReactElement } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const beforePrimaryToolbarPluginWrapperStyles = css({
	display: 'flex',
	marginRight: token('space.100', '8px'),
	flexGrow: 1,
	justifyContent: 'flex-end',
	alignItems: 'center',
});

type ReactComponents = ReactElement<any> | ReactElement<any>[];

// Duplicate of the wrapper from `editor-plugins/before-primary-toolbar` used
// only in `FullPageToolbar` to decouple the plugin from the main toolbar
export const BeforePrimaryToolbarWrapper = (props: {
	beforePrimaryToolbarComponents: ReactComponents | undefined;
}) => (
	<div
		css={beforePrimaryToolbarPluginWrapperStyles}
		data-testid={'before-primary-toolbar-components-plugin'}
	>
		{props.beforePrimaryToolbarComponents}
	</div>
);
