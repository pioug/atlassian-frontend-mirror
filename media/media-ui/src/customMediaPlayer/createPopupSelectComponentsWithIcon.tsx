/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// Keep PlaybackSpeedControls to use static colors from the new color palette to support the hybrid
// theming in media viewer https://product-fabric.atlassian.net/browse/DSP-6067
// with the compiled react, we are leaving the static colors in tact for now.

import React from 'react';

import { cssMap } from '@compiled/react';

import { Flex } from '@atlaskit/primitives/compiled'; // eslint-disable-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { components } from '@atlaskit/react-select/components';
import type { PopupSelect } from '@atlaskit/select/popup-select';

// `cssMap` usages cannot be exported (@atlaskit/design-system/no-invalid-css-map), so this style
// map is declared locally in each module that needs it rather than shared via an import.
const selectOptionStyles = cssMap({
	root: {
		'&:active': {
			backgroundColor: '#a6c5e229',
		},
	},
});

export const createPopupSelectComponentsWithIcon = (
	IconComponent: React.ComponentType<{ label: string; value: string }>,
): PopupSelect['props']['components'] => ({
	Option: ({ children, ...props }) => {
		const childrenWithIcon = (
			<Flex justifyContent="space-between" alignItems="center">
				{children}
				<IconComponent label={props.label} value={`${props.data.value}`} />
			</Flex>
		);
		return (
			<components.Option {...props} children={childrenWithIcon} xcss={selectOptionStyles.root} />
		);
	},
});
