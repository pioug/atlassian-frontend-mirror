import { createContext } from 'react';

import type { AnnotationProviders } from '@atlaskit/editor-common/types';
import type { AnnotationId, AnnotationMarkStates } from '@atlaskit/adf-schema';

export const ProvidersContext = createContext<AnnotationProviders | null | undefined>(null);
export const InlineCommentsStateContext = createContext<
	Record<AnnotationId, AnnotationMarkStates | null>
>({});
