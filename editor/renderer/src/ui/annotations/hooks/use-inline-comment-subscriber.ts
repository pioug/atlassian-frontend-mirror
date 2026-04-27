import { useContext } from 'react';
import { ProvidersContext } from '../context';
import type { AnnotationUpdateEmitter } from '@atlaskit/editor-common/types';

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
