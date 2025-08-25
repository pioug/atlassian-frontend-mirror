import type { CardAdf, DatasourceAdf } from '@atlaskit/linking-common';

export type CardAppearance = 'inline' | 'block' | 'embed';

export interface CardProvider {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	findPattern(url: string): Promise<boolean>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	resolve(
		url: string,
		appearance: CardAppearance,
		shouldForceAppearance?: boolean,
		isEmbedFriendlyLocation?: boolean,
	): Promise<CardAdf | DatasourceAdf>;
}
