import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import type { EditorAppearanceComponentProps } from '../types/editor-appearance-component';

export type WithAppearanceComponent = {
	AppearanceComponent: React.ComponentType<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		React.PropsWithChildren<EditorAppearanceComponentProps<NextEditorPlugin<any, any>[]>>
	>;
};
