/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { jsx } from '@emotion/react';

import { resizableMediaMigrationNotificationStyle } from './styles';

export const ResizableMediaMigrationNotification = (): jsx.JSX.Element => {
	return (
		<div
			data-testid="resizable-media-migration-notification"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[resizableMediaMigrationNotificationStyle]}
		/>
	);
};
