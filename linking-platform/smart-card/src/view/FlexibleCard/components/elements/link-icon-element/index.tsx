import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseIconElement, type BaseIconElementProps, toLinkIconProps } from '../common';

export type LinkIconElementProps = BaseIconElementProps;

const LinkIconElement = (props: LinkIconElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();

	if (!context) {
		return null;
	}

	if (fg('platform-linking-visual-refresh-v2')) {
		const data = toLinkIconProps(context?.linkIcon, context.type) as object | undefined | null;
		return data ? <BaseIconElement {...data} {...props} name={ElementName.LinkIcon} /> : null;
	}
	const data = typeof context?.linkIcon === 'object' ? context?.linkIcon : undefined;

	return data ? <BaseIconElement {...data} {...props} name={ElementName.LinkIcon} /> : null;
};

export default LinkIconElement;
