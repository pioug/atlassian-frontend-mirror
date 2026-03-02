import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

export type UiControlRegistryPlugin = NextEditorPlugin<
	'uiControlRegistry',
	{
		actions: {
			getComponents: (surface: string) => RegisterComponent[];
			register: (components: RegisterComponent[]) => void;
		};
	}
>;
