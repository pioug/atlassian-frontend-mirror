import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { TablePluginState } from '../types';

export const shallowEqualExcept = <T extends object>(
	previousValue: T,
	currentValue: T,
	ignoredKey: keyof T,
): boolean => {
	const previousKeys = Object.keys(previousValue);
	const currentKeys = Object.keys(currentValue) as Array<keyof T>;

	return (
		previousKeys.length === currentKeys.length &&
		currentKeys.every(
			(key) =>
				key === ignoredKey ||
				(Object.prototype.hasOwnProperty.call(previousValue, key) &&
					Object.is(previousValue[key], currentValue[key])),
		)
	);
};

/**
 * Returns true when editor focus is the only table plugin state value that changed.
 *
 * Table reducers preserve references for unchanged values. If a reducer rebuilds a value, this
 * returns false and callers take the original full-work path rather than skipping incorrectly.
 */
export const isFocusOnlyChange = (
	previousState: TablePluginState,
	currentState: TablePluginState,
): boolean =>
	previousState.editorHasFocus !== currentState.editorHasFocus &&
	shallowEqualExcept(previousState, currentState, 'editorHasFocus');

export class FocusOnlyUpdateGuard {
	private lastProcessedState: TablePluginState | undefined;

	/** Returns true and records the state when this is a skippable focus-only update. */
	skipIfFocusOnly(state: TablePluginState): boolean {
		const lastProcessedState = this.lastProcessedState;
		if (
			lastProcessedState !== undefined &&
			isFocusOnlyChange(lastProcessedState, state) &&
			isExperimentEnabled('platform_editor_improve_inp')
		) {
			this.lastProcessedState = state;
			return true;
		}

		return false;
	}

	markProcessed(state: TablePluginState): void {
		this.lastProcessedState = state;
	}

	reset(): void {
		this.lastProcessedState = undefined;
	}
}
