import type { InternalError } from '../errors/internal-errors';
import { createLogger } from '../helpers/utils';
import type { Catchupv2Options, StepsPayload } from '../types';

const logger = createLogger('Catchupv2', 'red');

export const catchupv2 = async (opt: Catchupv2Options) => {
  let steps: any;
  let metadata: any;
  const fromVersion = opt.getCurrentPmVersion();

  try {
    ({ steps, metadata } = await opt.fetchCatchupv2(fromVersion, opt.clientId));
  } catch (error) {
    opt.analyticsHelper?.sendErrorEvent(
      error,
      'Error while fetching catchupv2 from server',
    );
    logger(
      `Fetch catchupv2 from server failed:`,
      (error as InternalError).message,
    );
    throw error;
  }

  try {
    const version = fromVersion + steps.length;

    const stepsPayload: StepsPayload = {
      version,
      steps,
    };

    opt.onStepsAdded(stepsPayload);
    opt.updateMetadata(metadata);
  } catch (error) {
    opt.analyticsHelper?.sendErrorEvent(
      error,
      'Failed to apply catchupv2 result in the editor',
    );
    logger(`Apply catchupv2 steps failed:`, (error as InternalError).message);
    throw error;
  }
};
