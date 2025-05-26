import React from 'react';

import { ElementName, IconType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps, toBadgeProps } from '../common';

export type LatestCommitElementProps = BaseBadgeElementProps;

const LatestCommitElement = (props: LatestCommitElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toBadgeProps(context.latestCommit?.toString()) : null;

	return data ? (
		<BaseBadgeElement icon={IconType.Commit} {...data} {...props} name={ElementName.LatestCommit} />
	) : null;
};

export default LatestCommitElement;
