import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, BaseBadgeElementProps } from '../common';

export type ProviderElementProps = BaseBadgeElementProps;

const ProviderElement = (props: ProviderElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context?.provider ?? null;

	return data ? <BaseBadgeElement {...data} {...props} name={ElementName.Provider} /> : null;
};

export default ProviderElement;
