import { createLogger } from '../helpers/utils';
import { StepsPayload, CatchupResponse } from '../channel';
import { CollabInitPayload } from '.';
import { StepMap, Mapping, Step } from 'prosemirror-transform';
import { Transaction } from 'prosemirror-state';

export interface CatchupOptions {
  getCurrentPmVersion: () => number;
  fetchCatchup: (fromVersion: number) => Promise<CatchupResponse>;
  fitlerQueue: (condition: (stepsPayload: StepsPayload) => boolean) => void;
  getUnconfirmedSteps: () =>
    | {
        version: number;
        steps: Step<any>[];
        clientID: string | number;
        origins: Transaction<any>[];
      }
    | null
    | undefined;
  updateDocumentWithMetadata: ({
    doc,
    version,
    metadata,
    reserveCursor,
  }: CollabInitPayload) => void;
  applyLocalsteps: (steps: Step[]) => void;
}

const logger = createLogger('Catchup', 'red');

/**
 * Rebase the steps based on the mapping pipeline.
 * Some steps could be lost, if they are no longer
 * invalid after rebased.
 */
export function rebaseSteps(steps: Step[], mapping: Mapping): Step[] {
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

export const catchup = async (opt: CatchupOptions) => {
  const {
    doc,
    stepMaps: serverStepMaps,
    version: serverVersion,
    metadata,
  } = await opt.fetchCatchup(opt.getCurrentPmVersion());

  if (doc) {
    const currentPmVersion = opt.getCurrentPmVersion();
    if (typeof serverVersion === 'undefined') {
      logger(`Could not determine server version`);
    } else if (serverVersion <= currentPmVersion) {
      logger(`Catchup steps we already have. Ignoring.`);
    } else {
      // Please, do not use those steps inside of async
      // method. That will lead to outdated steps
      const { steps: unconfirmedSteps } = opt.getUnconfirmedSteps() || {
        steps: [],
      };
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
      opt.fitlerQueue((data) => data.version > serverVersion);

      // We are too far behind - replace the entire document
      logger(`Replacing document: ${doc}`);
      logger(`getting metadata: ${metadata}`);

      // Replace local document and version number
      opt.updateDocumentWithMetadata({
        doc: JSON.parse(doc),
        version: serverVersion,
        metadata,
        reserveCursor: true,
      });

      // After replacing the whole document in the editor, we need to reapply the unconfirmed
      // steps back into the editor, so we don't lose any data. But before that, we need to rebase
      // those steps since their position could be changed after replacing.
      // https://prosemirror.net/docs/guide/#transform.rebasing
      if (unconfirmedSteps.length) {
        // Create StepMap from StepMap JSON
        // eslint-disable-next-line no-unused-vars
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
        // create Mappng used for Step.map
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
        logger(
          `Re-aply ${
            newUnconfirmedSteps.length
          } mapped unconfirmed steps: ${JSON.stringify(newUnconfirmedSteps)}`,
        );
        // Re-aply local steps
        opt.applyLocalsteps(newUnconfirmedSteps);
      }
    }
  }
};
