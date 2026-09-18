import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { RegisterOptions } from '@atlaskit/editor-ui-control-model/create-registry';
import type { SurfaceIdentifier } from '@atlaskit/editor-ui-control-model/surface-renderer/types';
import type {
	ComponentIdentifier,
	RegisterComponent,
} from '@atlaskit/editor-ui-control-model/types';

export type UiControlRegistryPlugin = NextEditorPlugin<
	'uiControlRegistry',
	{
		actions: {
			getComponent: (component: ComponentIdentifier) => RegisterComponent | undefined;
			getComponents: (surface: string | SurfaceIdentifier) => RegisterComponent[];
			register: (components: RegisterComponent[], options?: RegisterOptions) => void;
			unregister: (components: ComponentIdentifier[]) => void;
		};
	}
>;
