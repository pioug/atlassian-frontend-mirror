import React, { useState } from 'react';

import LazilyRender from 'react-lazily-render';

import { startUfoExperience } from '../../../state/analytics/ufoExperiences';
import { CardWithUrlContent } from '../component';
import { type CardWithUrlContentProps } from '../types';

import { LoadingCardLink } from './LoadingCardLink';

export function LazyLazilyRenderCard(props: CardWithUrlContentProps): React.JSX.Element {
	const { appearance, container, id } = props;
	const offset = Math.ceil(window.innerHeight / 4);

	useState(() => {
		// Start of experience when intersectionObserver is not supported.
		startUfoExperience('smart-link-rendered', id);
	});

	return (
		<LazilyRender
			offset={offset}
			component={appearance === 'inline' ? 'span' : 'div'}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="loader-wrapper"
			placeholder={<LoadingCardLink {...props} />}
			scrollContainer={container}
			content={<CardWithUrlContent {...props} />}
		/>
	);
}
