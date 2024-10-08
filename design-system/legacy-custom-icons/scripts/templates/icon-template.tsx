const iconTemplate = `import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const {{iconName}}Glyph = (props: CustomGlyphProps) => (
	// TODO replace with custom glyph
	<svg
		width="24"
		height="24"
		viewBox="0 0 21 20"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<rect x="0.499939" width="20" height="20" rx="3" fill="currentColor" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M11.4999 9V5C11.4999 4.73478 11.3946 4.48043 11.207 4.29289C11.0195 4.10536 10.7652 4 10.4999 4C10.2347 4 9.98037 4.10536 9.79283 4.29289C9.6053 4.48043 9.49994 4.73478 9.49994 5V9H5.49994C5.23472 9 4.98037 9.10536 4.79283 9.29289C4.6053 9.48043 4.49994 9.73478 4.49994 10C4.49994 10.2652 4.6053 10.5196 4.79283 10.7071C4.98037 10.8946 5.23472 11 5.49994 11H9.49994V15C9.49994 15.2652 9.6053 15.5196 9.79283 15.7071C9.98037 15.8946 10.2347 16 10.4999 16C10.7652 16 11.0195 15.8946 11.207 15.7071C11.3946 15.5196 11.4999 15.2652 11.4999 15V11H15.4999C15.7652 11 16.0195 10.8946 16.207 10.7071C16.3946 10.5196 16.4999 10.2652 16.4999 10C16.4999 9.73478 16.3946 9.48043 16.207 9.29289C16.0195 9.10536 15.7652 9 15.4999 9H11.4999Z"
			fill="inherit"
		/>
	</svg>
);

/**
 * __{{iconName}}__
 */
const {{iconName}} = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={{{iconName}}Glyph}
	/>
);

export default {{iconName}};
`;

export default iconTemplate;
