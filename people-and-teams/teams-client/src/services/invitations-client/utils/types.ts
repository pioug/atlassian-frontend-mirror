import { type Capability, type ProductARI, type Recommendation } from '../types';

export type RecommendationWithCapability = Recommendation & {
	capability: Capability;
};

export type RecommendationsByProductAri = {
	[key: ProductARI]: RecommendationWithCapability;
};
