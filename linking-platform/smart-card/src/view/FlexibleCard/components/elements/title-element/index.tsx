import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { ElementName } from '../../../../../constants';
import { useFlexibleCardContext } from '../../../../../state/flexible-ui-context/useFlexibleCardContext';
import { BaseLinkElement, type BaseLinkElementProps } from '../common';

export type TitleElementProps = BaseLinkElementProps;

const TitleElement = (props: TitleElementProps): JSX.Element | null => {
	const context = useFlexibleCardContext();
	const data = context?.data?.linkTitle;

	return data ? (
		<BaseLinkElement
			{...data}
			url={
				fg('confluence_ep_shim_macro_links_v2') ? (context?.navigation?.url ?? data.url) : data.url
			}
			{...props}
			name={ElementName.Title}
		/>
	) : null;
};

export default TitleElement;
