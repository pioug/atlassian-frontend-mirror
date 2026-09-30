import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context/useFlexibleUiContext';
import { BaseIconElement, type BaseIconElementProps, toLinkIconProps } from '../common';
import { resourceTypeToLabel } from './resourceTypeToLabel';

export type LinkIconElementProps = BaseIconElementProps;

const LinkIconElement: (props: LinkIconElementProps) => JSX.Element | null = (props) => {
	const context = useFlexibleUiContext();

	if (!context) {
		return null;
	}

	const linkIconProps = toLinkIconProps(context?.linkIcon, context.type) as
		| BaseIconElementProps
		| undefined
		| null;

	if (!linkIconProps) {
		return null;
	}

	const jiraIssueTypeLabel =
		context.meta?.resourceType === 'issue' && context.type?.includes('atlassian:Task')
			? linkIconProps.label?.trim()
			: undefined;
	const label =
		jiraIssueTypeLabel ??
		resourceTypeToLabel(context.meta?.resourceType) ??
		linkIconProps.label?.trim() ??
		props.label;

	return (
		<BaseIconElement {...linkIconProps} {...props} label={label} name={ElementName.LinkIcon} />
	);
};

export default LinkIconElement;
