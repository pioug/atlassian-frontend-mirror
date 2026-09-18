import { useMemo } from 'react';

import type CardClient from '@atlaskit/link-provider/client';
import { getResolverUrl } from '@atlaskit/linking-common/get-resolver-url';
import type { EnvironmentsKeys } from '@atlaskit/linking-common/types';

export const useResolverUrl = (cardClient: CardClient): string =>
	useMemo(
		() => getResolverUrl(cardClient?.envKey as EnvironmentsKeys, cardClient?.baseUrlOverride),
		[cardClient?.baseUrlOverride, cardClient?.envKey],
	);
