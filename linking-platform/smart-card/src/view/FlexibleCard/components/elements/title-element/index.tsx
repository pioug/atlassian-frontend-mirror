import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseLinkElement, type BaseLinkElementProps, toLinkProps } from '../common';

export type TitleElementProps = BaseLinkElementProps;

const TitleElement = (props: TitleElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();

	const data = context
		? fg('platform-linking-flexible-card-context')
			? context?.linkTitle
			: toLinkProps(context.title, context.url)
		: null;

	return data ? <BaseLinkElement {...data} {...props} name={ElementName.Title} /> : null;
};

export default TitleElement;
