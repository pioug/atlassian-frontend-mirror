import { Step } from 'prosemirror-transform';
import { Plugin, Transaction } from 'prosemirror-state';
import { sendLogs } from '../../../utils/sendLogs';

const hasInvalidSteps = (tr: Transaction) =>
  ((tr.steps || []) as (Step & { from: number; to: number })[]).some(
    step => step.from > step.to,
  );

export default () => {
  return new Plugin({
    filterTransaction(tr) {
      if (hasInvalidSteps(tr)) {
        // eslint-disable-next-line no-console
        console.warn(
          'The transaction was blocked because it contains invalid steps',
          tr.steps,
        );

        sendLogs({
          events: [
            {
              name: 'atlaskit.fabric.editor.invalidstep',
              product: 'atlaskit',
              properties: {
                message: 'Blocked transaction with invalid steps',
              },
              serverTime: new Date().getTime(),
              server: 'local',
              user: '-',
            },
          ],
        });
        return false;
      }

      return true;
    },
  });
};
