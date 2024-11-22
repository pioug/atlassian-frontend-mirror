import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const EnergyIconGlyph = (props: CustomGlyphProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fill="currentColor"
			d="M10.1838 4.7875a.5.5 0 0 1 .4537-.2875l6.3636.014a.5.5 0 0 1 .3824.821l-3.4389 4.1098h2.9151a.5.5 0 0 1 .3435.8634l-9.58 9.0552a.5.5 0 0 1-.782-.6036l3.0213-5.515H7a.5.5 0 0 1-.4526-.7125l3.6364-7.7448Z"
		/>
	</svg>
);

/**
 * __EnergyIcon__
 */
const EnergyIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={EnergyIconGlyph}
	/>
);

export default EnergyIcon;
