import React from 'react';
import { type CardWithUrlContentProps } from '../types';
import { CardLinkView } from '../../../view/LinkView';

import { loadingPlaceholderClassName } from './LazyFallback';

export const LoadingCardLink = ({ isSelected, url, placeholder }: CardWithUrlContentProps) => {
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
