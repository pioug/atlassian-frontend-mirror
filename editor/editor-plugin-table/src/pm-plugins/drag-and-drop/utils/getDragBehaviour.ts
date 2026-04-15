import { getBrowserInfo } from '@atlaskit/editor-common/browser';
import type { Input } from '@atlaskit/pragmatic-drag-and-drop/types';

import type { DraggableBehaviour } from '../../../types';

export const getDragBehaviour = ({ altKey, ctrlKey }: Input): DraggableBehaviour => {
	const browser = getBrowserInfo();
	const isCloneModifierKeyPressed = browser.mac ? altKey : ctrlKey;
	return isCloneModifierKeyPressed ? 'clone' : 'move';
};
