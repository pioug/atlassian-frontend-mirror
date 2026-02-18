/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useContext } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { ArrowKeyNavigationType } from '../ArrowKeyNavigationProvider/types';
import DropdownComponent from '../Dropdown';
import type { DropdownPropsWithOutsideClickProps } from '../Dropdown';
import { KeyDownHandlerContext } from '../ToolbarArrowKeyNavigationProvider';

export const DropdownContainer = React.memo(function DropdownContainer(
	props: DropdownPropsWithOutsideClickProps,
) {
	const keyDownHandlerContext = useContext(KeyDownHandlerContext);
	let newArrowKeyNavigationProviderOptions = props.arrowKeyNavigationProviderOptions;
	// if the dropdown is of type menu, use this keyDownHandlerContext
	if (props.arrowKeyNavigationProviderOptions.type === ArrowKeyNavigationType.MENU) {
		newArrowKeyNavigationProviderOptions = {
			...props.arrowKeyNavigationProviderOptions,
			keyDownHandlerContext,
		};
	}
	return (
		//This context is to handle the tab, Arrow Right/Left key events for dropdown.
		//Default context has the void callbacks for above key events
		<DropdownComponent
			// eslint-disable-next-line react/jsx-props-no-spreading -- Spreading props to pass through dynamic component props
			{...props}
			arrowKeyNavigationProviderOptions={newArrowKeyNavigationProviderOptions}
		/>
	);
});
