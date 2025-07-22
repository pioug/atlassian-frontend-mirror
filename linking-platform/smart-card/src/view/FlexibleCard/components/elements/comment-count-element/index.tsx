import React, { useEffect } from 'react';

import { ElementName, IconType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps, toBadgeProps } from '../common';

export type CommentCountElementProps = BaseBadgeElementProps & {
	onRender?: (hasData: boolean) => void;
};

const CommentCountElement = (props: CommentCountElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toBadgeProps(context.commentCount?.toString()) : null;

	const { onRender, ...restProps } = props || {};

	useEffect(() => {
		onRender?.(!!data);
	}, [data, onRender]);

	return data ? (
		<BaseBadgeElement
			icon={IconType.Comment}
			{...data}
			{...restProps}
			name={ElementName.CommentCount}
		/>
	) : null;
};

export default CommentCountElement;
