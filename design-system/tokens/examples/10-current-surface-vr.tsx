/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

import { useVrGlobalTheme } from './utils/use-vr-global-theme';

const styles = cssMap({
	box: {
		marginTop: token('space.250'),
		marginRight: token('space.250'),
		marginBottom: token('space.250'),
		marginLeft: token('space.250'),
		paddingTop: token('space.250'),
		paddingRight: token('space.250'),
		paddingBottom: token('space.250'),
		paddingLeft: token('space.250'),
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
		borderStyle: 'solid',
	},
	currentSurface: {
		backgroundColor: token('utility.elevation.surface.current'),
	},
});

const SurfaceAwareBox = () => (
	<div css={[styles.box, styles.currentSurface]}>This box uses the current surface value.</div>
);

export default () => {
	useVrGlobalTheme();
	return (
		<div>
			<div
				css={styles.box}
				style={
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						[CURRENT_SURFACE_CSS_VAR]: token('color.background.success'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						backgroundColor: token('color.background.success'),
					} as CSSProperties
				}
			>
				<p>This box sets the current surface value.</p>
				<div
					css={styles.box}
					style={
						{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							[CURRENT_SURFACE_CSS_VAR]: token('color.background.warning'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							backgroundColor: token('color.background.warning'),
						} as CSSProperties
					}
				>
					<p>This box sets the current surface value.</p>
					<SurfaceAwareBox />
				</div>
				<div
					css={styles.box}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
