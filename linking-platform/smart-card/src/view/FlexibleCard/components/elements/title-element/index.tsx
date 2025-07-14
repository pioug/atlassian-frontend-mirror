import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseLinkElement, type BaseLinkElementProps } from '../common';

export type TitleElementProps = BaseLinkElementProps;

const TitleElement = (props: TitleElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? context?.linkTitle : null;

	return data ? <BaseLinkElement {...data} {...props} name={ElementName.Title} /> : null;
};

export default TitleElement;
