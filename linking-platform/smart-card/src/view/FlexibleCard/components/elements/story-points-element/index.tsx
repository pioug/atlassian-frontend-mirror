import React from 'react';

import { ElementName } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import {
	BaseAtlaskitBadgeElement,
	type BaseAtlaskitBadgeElementProps,
	toAtlaskitBadgeProps,
} from '../common';

export type StoryPointsElementProps = BaseAtlaskitBadgeElementProps;

const StoryPointsElement = (props: StoryPointsElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toAtlaskitBadgeProps(context.storyPoints) : null;

	return data ? (
		<BaseAtlaskitBadgeElement {...data} {...props} name={ElementName.StoryPoints} />
	) : null;
};

export default StoryPointsElement;
