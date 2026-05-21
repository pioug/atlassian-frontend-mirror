/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import CommentCount from '../view/FlexibleCard/components/elements/comment-count-element';

type CommentCountElementProps = Pick<
	React.ComponentProps<typeof CommentCount>,
	'color' | 'onRender'
>;

export const CommentCountElement = (props?: CommentCountElementProps): React.JSX.Element => {
	return <CommentCount color={props?.color} onRender={props?.onRender} />;
};
