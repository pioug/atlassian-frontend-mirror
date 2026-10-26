import React from 'react';

import type { RuleAttributes } from '@atlaskit/adf-schema/rule';
import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette/text';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

export default function Rule({
	color,
	localId,
	style,
	weight,
}: RuleAttributes = {}): React.JSX.Element {
	if (!isExperimentEnabled('platform_editor_lovability_dividers_attributes')) {
		return <hr role="presentation" />;
	}

	const paletteColor = color && (hexToEditorTextPaletteColor(color) ?? color);
	const paletteStyle = paletteColor
		? ({ '--custom-palette-color': paletteColor } as React.CSSProperties)
		: undefined;

	return (
		<hr
			role="presentation"
			data-color={color || undefined}
			data-local-id={localId || undefined}
			data-style={style || undefined}
			data-weight={weight ?? undefined}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={paletteStyle}
		/>
	);
}
