import React from 'react';

import { isIntersectionObserverSupported } from '../../../utils';
import { type CardWithUrlContentProps } from '../types';

import { LazyIntersectionObserverCard } from './LazyIntersectionObserverCard';
import { LazyLazilyRenderCard } from './LazyLazilyRenderCard';

export default function LazyCardWithUrlContent(props: CardWithUrlContentProps) {
	if (isIntersectionObserverSupported()) {
		return <LazyIntersectionObserverCard {...props} />;
	} else {
		return <LazyLazilyRenderCard {...props} />;
	}
}
