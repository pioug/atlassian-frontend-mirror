import React from 'react';

import Icon from '@atlaskit/icon';
import type { CustomGlyphProps, IconProps } from '@atlaskit/icon/types';

const FormCardIconGlyph = (props: CustomGlyphProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="14"
		height="18"
		viewBox="0 0 14 18"
		data-testid={props['data-testid']}
		aria-label={props['aria-label']}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
	>
		<path
			fill="currentColor"
			d="M1.994 2v14h10V2h-10ZM0 1.791C0 .8028.897 0 2.006 0h9.988C13.102 0 14 .8082 14 1.791v14.418c0 .9891-.897 1.791-2.006 1.791H2.006c-.5295.0007-1.03778-.1873-1.41369-.5229C.21639 17.1415.00344 16.6855 0 16.209V1.791Z"
		/>
		<path
			fill="currentColor"
			d="M6.9013 11.1153h2.8718c.5287 0 .9572-.3997.9572-.8929 0-.4931-.4285-.8928-.9572-.8928H6.9013c-.5287 0-.9573.3997-.9573.8928 0 .4932.4286.8929.9573.8929ZM6.9013 8.2231h2.8718c.5287 0 .9572-.3997.9572-.8928 0-.49314-.4285-.89288-.9572-.89288H6.9013c-.5287 0-.9573.39974-.9573.89288 0 .4931.4286.8928.9573.8928ZM6.9013 5.40103h2.8718c.5287 0 .9572-.39975.9572-.89286s-.4285-.89286-.9572-.89286L6.9013 3.6153c-.5287 0-.9573.39976-.9573.89287 0 .49311.4286.89286.9573.89286ZM3.1488 5.32959h1.83796c0-.82142-.00001-1.22117 0-1.71429H3.1488v1.71429ZM3.22598 8.1517H5.0639V6.43742H3.22598V8.1517ZM3.22598 11.0439H5.0639V9.3296H3.22598v1.7143ZM4.18324 14H9.812c.5286 0 .9572-.3997.9572-.8929 0-.4931-.4286-.8928-.9572-.8928H4.18324c-.52868 0-.95726.3997-.95726.8928 0 .4932.42858.8929.95726.8929Z"
		/>
	</svg>
);

/**
 * __FormCardIcon__
 */
const FormCardIcon = ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => (
	<Icon
		label={label}
		primaryColor={primaryColor}
		secondaryColor={secondaryColor}
		size={size}
		testId={testId}
		glyph={FormCardIconGlyph}
	/>
);

export default FormCardIcon;
