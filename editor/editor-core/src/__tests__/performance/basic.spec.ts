import { expect, editorPerformanceTestCase as test } from '@af/editor-libra';

test.describe('@legacy-editor', () => {
  test.describe('Editor - Performance', () => {
    test.describe('full-page', () => {
      test.use({
        editorProps: {
          appearance: 'full-page',
        },
        editorPerformanceTestOptions: {
          editorVersion: 'legacy',
          performanceTestType: 'react-profile',
        },
      });

      test('typing', async ({ editor }) => {
        await editor.keyboard.type('LOL');

        expect(true).toBe(true);
      });
    });
  });
});
