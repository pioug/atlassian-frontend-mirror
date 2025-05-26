import React from 'react';

import { ElementName, SmartLinkInternalTheme } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseLinkElement, type BaseLinkElementProps } from '../common';

export type LocationElementProps = BaseLinkElementProps;

const LocationElement = (props: LocationElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context?.location ?? null;

	return data ? (
		<BaseLinkElement
			theme={SmartLinkInternalTheme.Grey}
			{...data}
			{...props}
			name={ElementName.Location}
		/>
	) : null;
};

export default LocationElement;
