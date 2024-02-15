import { expect, editorPerformanceTestCase as test } from '@af/editor-libra';

import { bigTable } from '../fixtures';

test.describe('@composable-full-page__input-latency', () => {
  test.describe('Editor - Performance', () => {
    test.describe('full-page__with-big-table', () => {
      test.use({
        editorProps: {
          appearance: 'full-page',
          allowTables: {
            advanced: true,
          },
        },
        editorPerformanceTestOptions: {
          editorVersion: 'composable',
          performanceTestType: 'input-latency',
        },
        adf: bigTable,
      });

      test('typing', async ({ editor }) => {
        await editor.selection.set({ anchor: 1, head: 1 });
        await Promise.allSettled([
          editor.keyboard.type('vvcccckddfnektkhdevnkkdvdhhgtnnlteutdhtknick', {
            delay: 0,
          }),

          editor.keyboard.type('vvcccckddfnevlucnkfjcufdreciuetvjchbrkgrdgeu', {
            delay: 0,
          }),

          editor.keyboard.type('vvcccckddfneljrnuugtdkcjtgneufngdfreibucniik', {
            delay: 0,
          }),
        ]);

        expect(true).toBe(true);
      });
    });
  });
});
