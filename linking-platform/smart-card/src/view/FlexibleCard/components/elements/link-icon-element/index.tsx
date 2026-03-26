import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseIconElement, type BaseIconElementProps, toLinkIconProps } from '../common';

import { resourceTypeToLabel } from './resourceTypeToLabel';

export type LinkIconElementProps = BaseIconElementProps;

const LinkIconElement = (props: LinkIconElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();

	if (!context) {
		return null;
	}

	if (fg('platform_navx_smart_link_icon_label_a11y')) {
		const linkIconProps = toLinkIconProps(context?.linkIcon, context.type) as
			| BaseIconElementProps
			| undefined
			| null;

		if (!linkIconProps) {
			return null;
		}

		const label =
			resourceTypeToLabel(context.meta?.resourceType) ?? linkIconProps.label?.trim() ?? props.label;

		return (
			<BaseIconElement {...linkIconProps} {...props} label={label} name={ElementName.LinkIcon} />
		);
	}

	const data = toLinkIconProps(context?.linkIcon, context.type) as object | undefined | null;
	return data ? <BaseIconElement {...data} {...props} name={ElementName.LinkIcon} /> : null;
};

export default LinkIconElement;
