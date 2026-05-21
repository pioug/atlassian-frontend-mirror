/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import Title from '../view/FlexibleCard/components/elements/title-element';

type TitleElementProps = Pick<
	React.ComponentProps<typeof Title>,
	'hideTooltip' | 'maxLines' | 'target' | 'text' | 'theme' | 'size' | 'testId'
>;

export const TitleElement = (props?: TitleElementProps): React.JSX.Element => (
	<Title
		hideTooltip={props?.hideTooltip}
		maxLines={props?.maxLines}
		target={props?.target}
		theme={props?.theme}
		size={props?.size}
		testId={props?.testId}
		{...(props?.text ? { text: props?.text } : undefined)}
	/>
);
