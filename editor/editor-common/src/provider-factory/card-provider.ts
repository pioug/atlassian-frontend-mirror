import type { CardAdf, DatasourceAdf } from '@atlaskit/smart-card';

export type CardAppearance = 'inline' | 'block' | 'embed';
export type { CardAdf, DatasourceAdf };

export interface CardProvider {
	resolve(
		url: string,
		appearance: CardAppearance,
		shouldForceAppearance?: boolean,
		isEmbedFriendlyLocation?: boolean,
	): Promise<CardAdf | DatasourceAdf>;
	findPattern(url: string): Promise<boolean>;
}
