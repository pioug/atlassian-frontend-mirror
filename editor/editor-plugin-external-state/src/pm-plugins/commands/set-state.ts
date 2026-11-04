import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';

import type { ExternalState, ExternalStateKey } from '../../externalStatePluginType';
import { ExternalStateStep } from '../external-state-step';
import { getChangedValues } from '../main';

/** Dispatches nothing when the value is unchanged. */
export const setState =
	<K extends ExternalStateKey>(
		getCurrentState: () => ExternalState,
		key: K,
		value: ExternalState[K],
	): EditorCommand =>
	({ tr }) => {
		const changed = getChangedValues(getCurrentState(), { [key]: value });
		return changed ? tr.step(new ExternalStateStep(changed, getCurrentState)) : null;
	};
