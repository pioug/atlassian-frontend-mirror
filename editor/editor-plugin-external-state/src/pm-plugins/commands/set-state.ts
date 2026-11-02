import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';

import type { ExternalState, ExternalStateKey } from '../../externalStatePluginType';
import { getChangedValues, setValuesMeta } from '../main';

/** Sets `key` in editor state only. Dispatches nothing when the value is unchanged. */
export const setState =
	<K extends ExternalStateKey>(
		getCurrentState: () => ExternalState,
		key: K,
		value: ExternalState[K],
	): EditorCommand =>
	({ tr }) => {
		const changed = getChangedValues(getCurrentState(), { [key]: value });
		return changed ? setValuesMeta(tr, changed) : null;
	};
