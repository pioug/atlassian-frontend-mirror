import { useMemo } from 'react';

import type { CardClient, EnvironmentsKeys } from '@atlaskit/link-provider';
import { getResolverUrl } from '@atlaskit/linking-common';

export const useResolverUrl = (cardClient: CardClient): string =>
	useMemo(
		() => getResolverUrl(cardClient?.envKey as EnvironmentsKeys, cardClient?.baseUrlOverride),
		[cardClient?.baseUrlOverride, cardClient?.envKey],
	);
