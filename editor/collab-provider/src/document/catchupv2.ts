import { EVENT_ACTION, EVENT_STATUS } from '../helpers/const';
import type { InternalError } from '../errors/internal-errors';
import { createLogger, getObfuscatedSteps, getDocAdfWithObfuscation } from '../helpers/utils';
import type { Catchupv2Options, StepsPayload } from '../types';
import type { StepJson } from '@atlaskit/editor-common/collab';
import { fg } from '@atlaskit/platform-feature-flags';

const logger = createLogger('Catchupv2', 'red');

export const catchupv2 = async (opt: Catchupv2Options): Promise<boolean> => {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let steps: any;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let metadata: any;
	const fromVersion = opt.getCurrentPmVersion();

	try {
		({ steps, metadata } = await opt.fetchCatchupv2(
			fromVersion,
			opt.clientId,
			opt.catchUpOutofSync,
			opt.reason,
		));
	} catch (error) {
		opt.analyticsHelper?.sendErrorEvent(error, 'Error while fetching catchupv2 from server');
		logger(`Fetch catchupv2 from server failed:`, (error as InternalError).message);
		throw error;
	}

	try {
		opt.onCatchupComplete?.(steps);
		// skip onStepsAdded if steps are undefined or empty
		if (!steps || steps.length === 0) {
			opt.updateMetadata(metadata);
			return false;
		}

		const version = fromVersion + steps.length;

		const stepsPayload: StepsPayload = {
			version,
			steps,
		};
		opt.onStepsAdded(stepsPayload);
		opt.updateMetadata(metadata);
		const clientOutOfSync = Boolean(
			opt.clientId && isOutOfSync(fromVersion, opt.getCurrentPmVersion(), steps, opt.clientId),
		);
		if (clientOutOfSync) {
			logObfuscatedSteps(steps, opt);
		}
		return clientOutOfSync;
	} catch (error) {
		opt.analyticsHelper?.sendErrorEvent(error, 'Failed to apply catchupv2 result in the editor');
		logger(`Apply catchupv2 steps failed:`, (error as InternalError).message);
		throw error;
	}
};

const logObfuscatedSteps = (steps: StepJson[], opt: Catchupv2Options) => {
	if (fg('platform_editor_log_obfuscated_steps')) {
		const state = opt.getState?.();
		opt.analyticsHelper?.sendActionEvent(EVENT_ACTION.OUT_OF_SYNC, EVENT_STATUS.FAILURE, {
			obfuscatedSteps: getObfuscatedSteps(steps),
			obfuscatedDoc: state ? getDocAdfWithObfuscation(state.doc) : null,
			catchupReason: opt.reason,
		});
	}
};

/**
 * Checks if we're out of sync with the backend because catchup failed to apply, and thus the doc should be reset.
 * @param fromVersion The document's PM version from before we applied catchup
 * @param currentVersion The document's PM version after we applied catchup
 * @param steps Steps returned to us by catchup
 * @param clientId The ID of the currently connected session (one user can have multiple if theu have multiple tabs open)
 * @returns True if we're out of sync, false if not.
 */
export const isOutOfSync = (
	fromVersion: number,
	currentVersion: number,
	steps: StepJson[],
	clientId: string | number,
): boolean =>
	// If version number hasn't increased, and steps are not from our client, we're out of sync
	Boolean(fromVersion >= currentVersion && steps.some((step) => step.clientId !== clientId));
