import { useContext } from 'react';

import { SmartCardContext } from '@atlaskit/link-provider/context';

import { shouldResolveUrl } from './shouldResolveUrl';

const useResolveHyperlinkValidator = (href: string = ''): boolean => {
	const hasSmartCardProvider = !!useContext(SmartCardContext);

	return hasSmartCardProvider && shouldResolveUrl(href);
};

export default useResolveHyperlinkValidator;
