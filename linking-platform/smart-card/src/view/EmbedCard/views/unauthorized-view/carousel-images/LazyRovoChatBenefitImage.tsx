import { lazy, type LazyExoticComponent } from 'react';

const LazyRovoChatBenefitImage: LazyExoticComponent<
	typeof import('./RovoChatBenefitImage').default
> = lazy(
	() =>
		import(
			/* webpackChunkName: "smart-card-embed-carousel-rovo-chat-benefit-image" */ './RovoChatBenefitImage'
		),
);

export default LazyRovoChatBenefitImage;
