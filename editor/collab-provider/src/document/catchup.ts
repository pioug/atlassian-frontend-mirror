import type { InternalError } from '../errors/internal-errors';
import { EVENT_ACTION, EVENT_STATUS } from '../helpers/const';
import { createLogger } from '../helpers/utils';
import type { CatchupOptions, StepsPayload } from '../types';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { StepMap, Mapping } from '@atlaskit/editor-prosemirror/transform';

const logger = createLogger('Catchup', 'red');

/**
 * Rebase the steps based on the mapping pipeline.
 * Some steps could be lost, if they are no longer
 * invalid after rebased.
 */
export function rebaseSteps(steps: readonly Step[], mapping: Mapping): Step[] {
  const newSteps: Step[] = [];
  for (const step of steps) {
    const newStep = step.map(mapping);
    // newStep could be null(means invalid after rebase) when can't rebase.
    if (newStep) {
      newSteps.push(newStep);
    }
  }
  return newSteps;
}

/**
 * Check if clientId is in list of StepMaps returned by server, to avoid duplicating content
 * Each time a StepMap contains the clientId, we should drop an unconfirmedStep
 */
export function removeConfirmedSteps(
  unconfirmedSteps: readonly Step[] = [],
  serverStepMaps: any[] = [],
  clientId: string | number | undefined,
) {
  let newUnconfirmedSteps = Array.from(unconfirmedSteps);
  for (let i = 0; i < serverStepMaps.length; i++) {
    if (serverStepMaps[i].clientId === clientId) {
      newUnconfirmedSteps.shift();
    }
  }
  return newUnconfirmedSteps;
}

export const catchup = async (opt: CatchupOptions) => {
  let doc, serverStepMaps, serverVersion: number | undefined, metadata;

  try {
    ({
      doc,
      stepMaps: serverStepMaps,
      version: serverVersion,
      metadata,
    } = await opt.fetchCatchup(opt.getCurrentPmVersion(), opt.clientId));
  } catch (error) {
    opt.analyticsHelper?.sendErrorEvent(
      error,
      'Error while fetching catchup from server',
    );
    logger(
      `Fetch catchup from server failed:`,
      (error as InternalError).message,
    );
    throw error;
  }

  try {
    if (doc) {
      const currentPmVersion = opt.getCurrentPmVersion();
      if (typeof serverVersion === 'undefined') {
        logger(`Could not determine server version`);
      } else if (serverVersion <= currentPmVersion) {
        // there are no step maps in this case after page recovery
        const unconfirmedSteps = opt.getUnconfirmedSteps();

        // replace the entire document
        logger(`Replacing document: ${doc}`);
        logger(`getting metadata: ${metadata}`);
        // Replace local document and version number
        opt.updateDocument({
          doc: JSON.parse(doc),
          version: serverVersion,
          metadata,
          reserveCursor: true,
        });
        opt.updateMetadata(metadata);
        if (unconfirmedSteps?.length) {
          opt.applyLocalSteps(unconfirmedSteps as Step[]);
        }
      } else {
        // Please, do not use those steps inside of async
        // method. That will lead to outdated steps
        let unconfirmedSteps = opt.getUnconfirmedSteps();
        logger(
          `Too far behind[current: v${currentPmVersion}, server: v${serverVersion}. ${
            serverStepMaps!.length
          } steps need to catchup]`,
        );
        /**
         * Remove steps from queue where the version is older than
         * the version we received from service. Keep steps that might be
         * newer.
         */
        opt.filterQueue((data: StepsPayload) => data.version > serverVersion!);

        // We are too far behind - replace the entire document
        logger(`Replacing document: ${doc}`);
        logger(`getting metadata: ${metadata}`);

        // Replace local document and version number
        opt.updateDocument({
          doc: JSON.parse(doc),
          version: serverVersion,
          metadata,
          reserveCursor: true,
        });
        opt.updateMetadata(metadata);

        // After replacing the whole document in the editor, we need to reapply the unconfirmed
        // steps back into the editor, so we don't lose any data. But before that, we need to rebase
        // those steps since their position could be changed after replacing.
        // https://prosemirror.net/docs/guide/#transform.rebasing
        if (unconfirmedSteps?.length) {
          // Create StepMap from StepMap JSON
          // eslint-disable-next-line no-unused-vars
          unconfirmedSteps = removeConfirmedSteps(
            unconfirmedSteps,
            serverStepMaps,
            opt.clientId,
          );
          const stepMaps = serverStepMaps!.map(
            ({
              ranges,
              inverted,
            }: {
              ranges: [number, number, number];
              inverted: boolean;
            }) => {
              // Due to @types/prosemirror-transform mismatch with the actual
              // constructor, hack to set the `inverted`.
              const stepMap = new StepMap(ranges);
              (stepMap as any).inverted = inverted;
              return stepMap;
            },
          );
          // create Mapping used for Step.map
          const mapping: Mapping = new Mapping(stepMaps);
          logger(
            `${
              unconfirmedSteps.length
            } unconfirmed steps before rebased: ${JSON.stringify(
              unconfirmedSteps,
            )}`,
          );
          const newUnconfirmedSteps: Step[] = rebaseSteps(
            unconfirmedSteps,
            mapping,
          );

          if (newUnconfirmedSteps?.length < unconfirmedSteps.length) {
            // Log the dropped steps after rebase
            opt.analyticsHelper?.sendActionEvent(
              EVENT_ACTION.DROPPED_STEPS,
              EVENT_STATUS.SUCCESS,
              {
                numOfDroppedSteps:
                  unconfirmedSteps.length - newUnconfirmedSteps?.length,
              },
            );
          }
          logger(
            `Re-aply ${
              newUnconfirmedSteps.length
            } mapped unconfirmed steps: ${JSON.stringify(newUnconfirmedSteps)}`,
          );
          // Re-apply local steps
          opt.applyLocalSteps(newUnconfirmedSteps);
        }
      }
    }
  } catch (error) {
    opt.analyticsHelper?.sendErrorEvent(
      error,
      'Failed to apply catchup result in the editor',
    );
    logger(`Apply catchup steps failed:`, (error as InternalError).message);
    throw error;
  }
};
