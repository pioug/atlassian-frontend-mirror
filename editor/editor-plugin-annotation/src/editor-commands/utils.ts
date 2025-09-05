import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { AnnotationPlugin } from '../annotationPluginType';

export const setUserIntent = (
	api: ExtractInjectionAPI<AnnotationPlugin> | undefined,
	tr: Transaction,
) => {
	return api?.userIntent?.commands?.setCurrentUserIntent('commenting')({ tr });
};

export const resetUserIntent = (
	api: ExtractInjectionAPI<AnnotationPlugin> | undefined,
	tr: Transaction,
) => {
	return api?.userIntent?.commands?.setCurrentUserIntent('default')({ tr });
};
