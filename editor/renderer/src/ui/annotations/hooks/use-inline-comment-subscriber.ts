import { useContext } from 'react';

import type { AnnotationUpdateEmitter } from '@atlaskit/editor-common/types';

import { ProvidersContext } from '../context';

export const useInlineCommentSubscriberContext = (): AnnotationUpdateEmitter | null => {
	const providers = useContext(ProvidersContext);

	if (!providers) {
		return null;
	}

	const {
		inlineComment: { updateSubscriber },
	} = providers;

	return updateSubscriber || null;
};
