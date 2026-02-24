import type { CardAdf, DatasourceAdf } from '@atlaskit/linking-common';

export type CardAppearance = 'inline' | 'block' | 'embed';

export interface CardProvider {
	findPattern: (url: string) => Promise<boolean>;
	resolve: (
		url: string,
		appearance: CardAppearance,
		shouldForceAppearance?: boolean,
		isEmbedFriendlyLocation?: boolean,
	) => Promise<CardAdf | DatasourceAdf>;
}
