import { createContext, type Context } from 'react';

import type { AnnotationId, AnnotationMarkStates } from '@atlaskit/adf-schema/annotation';
import type { AnnotationProviders } from '@atlaskit/editor-common/types';

export const ProvidersContext: Context<AnnotationProviders | null | undefined> = createContext<
	AnnotationProviders | null | undefined
>(null);
export const InlineCommentsStateContext: Context<Record<string, AnnotationMarkStates | null>> =
	createContext<Record<AnnotationId, AnnotationMarkStates | null>>({});
