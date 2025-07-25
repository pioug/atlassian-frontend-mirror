import React, { type FC } from 'react';

import { type Size } from '@atlaskit/icon';
import { IconFacade } from '@atlaskit/icon/base';
import DashboardIcon from '@atlaskit/icon/core/dashboard';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const iconRowStyles = xcss({
	padding: 'space.200',
});

const oldIcon = `<svg viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="#42526E">
            <path d="M19.0043286,17 C19.000078,16.9999966 19,7.00585866 19,7.00585866 C19,7.00048676 4.9956714,7 4.9956714,7 C4.99992202,7.00000343 5,16.9941413 5,16.9941413 C5,16.9995132 19.0043286,17 19.0043286,17 Z M3,7.00585866 C3,5.89805351 3.8926228,5 4.99508929,5 L19.0049107,5 C20.1067681,5 21,5.89706013 21,7.00585866 L21,16.9941413 C21,18.1019465 20.1073772,19 19.0049107,19 L4.99508929,19 C3.8932319,19 3,18.1029399 3,16.9941413 L3,7.00585866 Z" id="Rectangle-3" fill-rule="nonzero"></path>
            <path d="M4,6 L20,6 L20,11 L4,11 L4,6 Z M9,8 C9,8.55613518 9.44565467,9 9.99539757,9 L18.0046024,9 C18.5443356,9 19,8.55228475 19,8 C19,7.44386482 18.5543453,7 18.0046024,7 L9.99539757,7 C9.4556644,7 9,7.44771525 9,8 Z M5,8 C5,8.55613518 5.44771525,9 6,9 C6.55613518,9 7,8.55228475 7,8 C7,7.44386482 6.55228475,7 6,7 C5.44386482,7 5,7.44771525 5,8 Z" id="Combined-Shape"></path>
        </g>
    </g>
</svg>`;

const IconRow: FC<{ size: Size }> = ({ size = 'medium' }) => (
	<Box xcss={iconRowStyles}>
		<div>{`Icon Size: ${size} `}</div>
		<IconFacade
			dangerouslySetGlyph={oldIcon}
			newIcon={DashboardIcon}
			label="Activity"
			size={size}
		/>
	</Box>
);

const IconFacadeExample = () => {
	const iconsSizes: Size[] = ['small', 'medium', 'large', 'xlarge'];

	return (
		<div>
			{iconsSizes.map((size, i) => (
				<IconRow key={i} size={size} />
			))}
		</div>
	);
};

export default IconFacadeExample;
