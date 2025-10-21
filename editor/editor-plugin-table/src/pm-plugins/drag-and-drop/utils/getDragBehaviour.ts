import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import type { Input } from '@atlaskit/pragmatic-drag-and-drop/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { DraggableBehaviour } from '../../../types';

export const getDragBehaviour = ({ altKey, ctrlKey }: Input): DraggableBehaviour => {
	const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
		? getBrowserInfo()
		: browserLegacy;
	const isCloneModifierKeyPressed = browser.mac ? altKey : ctrlKey;
	return isCloneModifierKeyPressed ? 'clone' : 'move';
};
