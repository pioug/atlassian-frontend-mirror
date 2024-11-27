/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

import { useVrGlobalTheme } from './utils/use-vr-global-theme';

const boxStyles = css({
	margin: 20,
	padding: 20,
	border: '1px solid',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderColor: token('color.border.bold'),
});

const currentSurfaceStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: token('utility.elevation.surface.current'),
});

const SurfaceAwareBox = () => (
	<div css={[boxStyles, currentSurfaceStyles]}>This box uses the current surface value.</div>
);

export default () => {
	useVrGlobalTheme();
	return (
		<div>
			<div
				css={boxStyles}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/enforce-style-prop
						[CURRENT_SURFACE_CSS_VAR]: token('color.background.success'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						backgroundColor: token('color.background.success'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					} as CSSProperties
				}
			>
				<p>This box sets the current surface value.</p>
				<div
					css={boxStyles}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={
						{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							[CURRENT_SURFACE_CSS_VAR]: token('color.background.warning'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							backgroundColor: token('color.background.warning'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						} as CSSProperties
					}
				>
					<p>This box sets the current surface value.</p>
					<SurfaceAwareBox />
				</div>
				<div
					css={boxStyles}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						backgroundColor: token('color.background.information'),
					}}
				>
					<p>This box does not set the current surface value.</p>
					<SurfaceAwareBox />
				</div>
			</div>
			<SurfaceAwareBox />
		</div>
	);
};
