import {
  EditorBreakoutModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';

test.describe('when our layout has breakout and copy button enabled', () => {
  const adf = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'layoutSection',
        content: [
          {
            type: 'layoutColumn',
            attrs: {
              width: 100,
            },
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'text',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowLayouts: true,
      allowBreakout: true,
    },
    adf,
    viewport: { width: 1040, height: 400 },
  });

  // This test is covering for the `useLayoutEffect` in `useSharedPluginState`
  // There was a race condition where the initial state wasn't setup properly
  test('should display the wide breakout button', async ({ editor }) => {
    await editor.selection.set({ anchor: 3, head: 3 });
    const breakoutModel = EditorBreakoutModel.from(editor);

    expect(await breakoutModel.isWideButtonVisible()).toBeTruthy();
  });
});
