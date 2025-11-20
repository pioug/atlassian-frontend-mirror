import React from 'react';

import { CardLinkView } from '../../../view/LinkView';
import { type CardWithUrlContentProps } from '../types';

import { loadingPlaceholderClassName } from './LazyFallback';

export const LoadingCardLink = ({
	isSelected,
	url,
	placeholder,
}: CardWithUrlContentProps): React.JSX.Element => {
	return (
		<CardLinkView
			key={'lazy-render-key'}
			testId={'lazy-render-placeholder'}
			data-trello-do-not-use-override="lazy-render-placeholder-trello"
			isSelected={isSelected}
			link={url}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={loadingPlaceholderClassName}
			placeholder={placeholder}
		/>
	);
};
