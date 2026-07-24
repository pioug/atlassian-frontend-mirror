import { lazy, type LazyExoticComponent } from 'react';

const LazyRovoSearchBenefitImage: LazyExoticComponent<
	typeof import('./RovoSearchBenefitImage').default
> = lazy(
	() =>
		import(
			/* webpackChunkName: "smart-card-embed-carousel-rovo-search-benefit-image" */ './RovoSearchBenefitImage'
		),
);

export default LazyRovoSearchBenefitImage;
