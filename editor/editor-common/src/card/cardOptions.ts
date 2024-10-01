import type { MouseEvent } from 'react';

import type { CardProps } from '@atlaskit/smart-card';

import type { Providers } from '../provider-factory';

export type OnClickCallback = ({
	event,
	url,
}: {
	event: MouseEvent<HTMLAnchorElement>;
	url?: string;
}) => void;
export interface CardOptions {
	provider?: Providers['cardProvider'];
	resolveBeforeMacros?: string[];
	allowBlockCards?: boolean;
	allowDatasource?: boolean;
	allowEmbeds?: boolean;
	allowResizing?: boolean;
	actionOptions?: CardProps['actionOptions'];
	useAlternativePreloader?: boolean;
	allowAlignment?: boolean;
	allowWrapping?: boolean;
	showUpgradeDiscoverability?: boolean;
	onClickCallback?: OnClickCallback;
	/**
	 * Customises the outbound link to configure user preferences
	 */
	userPreferencesLink?: string;
}
