import React from 'react';
import { type CardWithUrlContentProps } from '../types';
import { LazyLazilyRenderCard } from './LazyLazilyRenderCard';
import { LazyIntersectionObserverCard } from './LazyIntersectionObserverCard';
import { isIntersectionObserverSupported } from '../../../utils';

export default function LazyCardWithUrlContent(props: CardWithUrlContentProps) {
	if (isIntersectionObserverSupported()) {
		return <LazyIntersectionObserverCard {...props} />;
	} else {
		return <LazyLazilyRenderCard {...props} />;
	}
}
