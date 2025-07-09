/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// Keep PlaybackSpeedControls to use static colors from the new color palette to support the hybrid
// theming in media viewer https://product-fabric.atlassian.net/browse/DSP-6067
// with the compiled react, we are leaving the static colors in tact for now.
import React from 'react';
import { type PopupSelect, type OptionType, type StylesConfig, components } from '@atlaskit/select';
import { DN900 } from '@atlaskit/theme/colors';
import { cssMap } from '@compiled/react';
import { Flex } from '@atlaskit/primitives';

export const popupCustomStyles: StylesConfig<OptionType> = {
	container: (styles) => ({
		...styles,
		backgroundColor: '#22272b',
		boxShadow: 'inset 0px 0px 0px 1px #bcd6f00a,0px 8px 12px #0304045c,0px 0px 1px #03040480',
	}),
	// added these overrides to keep the look of the current design
	// however this does not benefit from the DS a11y changes
	menuList: (styles) => ({ ...styles, padding: '4px 0px' }),
	option: (styles, { isFocused, isSelected }) => ({
		...styles,
		color: isSelected ? '#579dff' : DN900,
		backgroundColor: isSelected ? '#082145' : isFocused ? '#a1bdd914' : '#22272b',
		':active': {
			backgroundColor: '#a6c5e229',
		},
	}),
	groupHeading: (styles) => ({
		...styles,
		color: '#9fadbc',
	}),
};

export const popperProps: PopupSelect['props']['popperProps'] = {
	strategy: 'fixed',
	modifiers: [
		{
			name: 'preventOverflow',
			enabled: true,
		},
		{
			name: 'eventListeners',
			options: {
				scroll: true,
				resize: true,
			},
		},
		{
			name: 'offset',
			enabled: true,
			options: {
				offset: [0, 10],
			},
		},
	],
	placement: 'top',
};

const selectOptionStyles = cssMap({
	root: {
		'&:active': {
			backgroundColor: '#a6c5e229',
		},
	},
});

export const popupSelectComponents: PopupSelect['props']['components'] = {
	Option: (props) => <components.Option {...props} xcss={selectOptionStyles.root} />,
};

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
