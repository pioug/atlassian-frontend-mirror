import { ROOT_CONTEXT } from '@opentelemetry/api';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getContextManager, UFOContextManager } from './context-manager';
import { state } from './state';

// DO NOT CALL THIS FUNCTION DIRECTLY!!!!
// It is only to be called by React UFO libraries for the automatic handling of trace context for experiences.
// Calling this may cause trace context to be broken
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function clearActiveTrace(): void {
	if (fg('platform_ufo_enable_otel_context_manager')) {
		// Now we need to get the global Context Manager and set the active context
		// Using type assertion because we've "extended" the ContextManager type
		if (getContextManager() instanceof UFOContextManager) {
			let contextManager = getContextManager() as UFOContextManager;

			// ROOT_CONTEXT is an empty context used to initialise ContextManagers
			contextManager.setActive(ROOT_CONTEXT);
		}
	} else {
		state.context = null;
	}
}
