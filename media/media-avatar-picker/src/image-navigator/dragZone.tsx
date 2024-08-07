/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { dragZoneStyles } from './styles';

export const DragZone = ({ showBorder, isDroppingFile, children, ...props }: any) => (
	<div
		data-testid="dragzone"
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		css={dragZoneStyles({
			showBorder: showBorder,
			isDroppingFile: isDroppingFile,
		})}
		{...props}
	>
		{children}
	</div>
);
