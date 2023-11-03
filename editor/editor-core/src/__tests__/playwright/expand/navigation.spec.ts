import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorExpandModel,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  p,
  doc,
  code_block,
  expand,
} from '@atlaskit/editor-test-helpers/doc-builder';

import {
  expandAdf,
  doubleCollapsedExpand,
  collapsedExpandAdf,
  multiLineExpandAdf,
  expandWithNestedCodeBlockTallAdf,
  expandWithNestedPanelAdf,
  expandWithNestedCodeBlockAdf,
} from './navigation.spec.ts-fixtures';

test.describe('expand: navigation', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExpand: true,
    },
  });

  test.use({
    adf: expandAdf,
  });

  test('navigation.ts: pressing Backspace should delete an expand when cursor is inside content', async ({
    editor,
  }) => {
    // Set selection inside expand paragraph
    await editor.selection.set({
      anchor: 2,
      head: 2,
    });
    await editor.keyboard.press('Backspace');

    await expect(editor).toHaveDocument(doc(p()));
  });

  test('navigation.ts: pressing Backspace should delete an expand when cursor is inside title', async ({
    editor,
  }) => {
    const { expand } = EditorNodeContainerModel.from(editor);
    const expandModel = EditorExpandModel.from(expand);

    await expandModel.titleInput.click();

    await editor.keyboard.press('Backspace');

    await expect(editor).toHaveDocument(doc(p()));
  });

  test('navigation.ts: pressing Enter should collapse an expand when cursor is inside title', async ({
    editor,
  }) => {
    const { expand: node } = EditorNodeContainerModel.from(editor);
    const expandModel = EditorExpandModel.from(node);

    await expandModel.titleInput.click();

    await editor.keyboard.press('Enter');

    await expect(editor).toHaveDocument(
      doc(expand({ __expanded: false })(p()), p()),
    );
  });

  test.describe('when expand is collapsed', () => {
    test.use({
      adf: collapsedExpandAdf,
    });

    test('navigation.ts: when cursor is after a collapsed expand, pressing Backspace should focus the title', async ({
      editor,
    }) => {
      const { expand: node } = EditorNodeContainerModel.from(editor);
      const expandModel = EditorExpandModel.from(node);

      await expandModel.titleInput.click();
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('Backspace');
      await editor.keyboard.type('I am here');

      await expect(editor).toHaveDocument(
        doc(expand({ title: 'I am here', __expanded: false })(p()), p()),
      );
    });
  });

  test.describe('when cursor is after two collapsed expands', () => {
    test.use({
      adf: doubleCollapsedExpand,
    });

    test('navigation.ts: pressing Backspace should focus the title of the second one', async ({
      editor,
    }) => {
      const { expand: node } = EditorNodeContainerModel.from(editor);
      const expandModel = EditorExpandModel.from(node.nth(1));

      await expandModel.titleInput.click();
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('Backspace');
      await editor.keyboard.type('I am here');

      await expect(editor).toHaveDocument(
        doc(
          p('ABC'),
          expand({ title: 'First title', __expanded: false })(p()),
          expand({ title: 'I am here', __expanded: false })(p()),
          p(),
        ),
      );
    });
  });

  test.describe('when cursor is inside content within a nested panel', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowPanel: true,
      },
    });
    test.use({
      adf: expandWithNestedPanelAdf,
    });

    test('navigation.ts: pressing Backspace should NOT delete an expand', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 3,
        head: 3,
      });
      await editor.keyboard.press('Backspace');

      await expect(editor).toHaveDocument(doc(expand({})(p()), p()));
    });
  });

  test.describe('when cursor is inside content within a nested code block', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
      },
    });
    test.use({
      adf: expandWithNestedCodeBlockAdf,
    });

    test('navigation.ts: pressing Backspace should NOT delete an expand', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });
      await editor.keyboard.press('Backspace');

      await expect(editor).toHaveDocument(doc(expand({})(p())));
    });
  });

  test.describe('given the gap cursor is on the left of the expand', () => {
    test('sets node selection when user hits right arrow', async ({
      editor,
    }) => {
      // Set selection inside expand paragraph
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await test.step('navigating until the gap cursor shows up', async () => {
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
      });

      await editor.keyboard.press('ArrowRight');

      await expect(editor).toHaveSelection({
        type: 'node',
        anchor: 0,
      });
    });

    test('sets selection inside expand title when user hits right arrow twice', async ({
      editor,
    }) => {
      // Set selection inside expand paragraph
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await test.step('navigating until the gap cursor shows up', async () => {
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
      });

      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('ArrowRight');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 2,
        head: 2,
      });
    });

    test('sets node selection when user hits right arrow thrice', async ({
      editor,
    }) => {
      // Set selection inside expand paragraph
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await test.step('navigating until the gap cursor shows up', async () => {
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
      });

      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('ArrowRight');

      await expect(editor).toHaveSelection({
        type: 'node',
        anchor: 0,
      });
    });

    test('sets right side gap cursor selection when user hits right arrow four times', async ({
      editor,
    }) => {
      // Set selection inside expand paragraph
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await test.step('navigating until the gap cursor shows up', async () => {
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
      });

      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('ArrowRight');
      await editor.keyboard.press('ArrowRight');

      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        side: 'right',
        pos: 4,
      });
    });
  });

  test.describe('given the gap cursor is on the right of the expand', () => {
    test('sets node selection when user hits left arrow', async ({
      editor,
    }) => {
      // Set selection inside expand paragraph
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });
      await test.step('navigating until the gap cursor shows up', async () => {
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');
      });
      await editor.keyboard.press('ArrowLeft');

      await expect(editor).toHaveSelection({
        type: 'node',
        anchor: 0,
      });
    });

    test('sets selection inside expand title when user hits left arrow twice', async ({
      editor,
    }) => {
      // Set selection inside expand paragraph
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });
      await test.step('navigating until the gap cursor shows up', async () => {
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');
      });
      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.press('ArrowLeft');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 2,
        head: 2,
      });
    });

    test('sets node selection when user hits right arrow thrice', async ({
      editor,
    }) => {
      // Set selection inside expand paragraph
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });
      await test.step('navigating until the gap cursor shows up', async () => {
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');
      });
      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'node',
        anchor: 0,
      });
    });

    test('sets left side gap cursor selection when user hits left arrow four times', async ({
      editor,
    }) => {
      // Set selection inside expand paragraph
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });
      await test.step('navigating until the gap cursor shows up', async () => {
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');
      });
      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.press('ArrowLeft');

      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        side: 'left',
        pos: 0,
      });
    });
  });

  test.describe('given the user clicks to select expand', () => {
    test('sets selection inside expand title when user hits left arrow', async ({
      editor,
    }) => {
      const { expand } = EditorNodeContainerModel.from(editor);

      // Set selection after the expand
      await editor.selection.set({
        anchor: 5,
        head: 5,
      });

      await expand.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      await editor.keyboard.press('ArrowLeft');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 2,
        head: 2,
      });
    });

    test('sets left side gap cursor selection when user hits left arrow twice', async ({
      editor,
    }) => {
      const { expand } = EditorNodeContainerModel.from(editor);

      // Set selection after the expand
      await editor.selection.set({
        anchor: 5,
        head: 5,
      });

      await expand.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.press('ArrowLeft');

      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        side: 'left',
        pos: 0,
      });
    });

    test('sets right side gap cursor selection when user hits right arrow', async ({
      editor,
    }) => {
      const { expand } = EditorNodeContainerModel.from(editor);

      // Set selection after the expand
      await editor.selection.set({
        anchor: 5,
        head: 5,
      });

      await expand.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      await editor.keyboard.press('ArrowRight');

      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        side: 'right',
        pos: 4,
      });
    });

    test.describe('and then clicks inside expand title', () => {
      test('sets node selection when user hits left arrow', async ({
        editor,
      }) => {
        const { expand } = EditorNodeContainerModel.from(editor);
        const expandModel = EditorExpandModel.from(expand);

        await expand.click({
          position: {
            x: 5,
            y: 5,
          },
        });

        await expandModel.titleInput.click();
        await editor.keyboard.press('ArrowLeft');

        await expect(editor).toHaveSelection({
          type: 'node',
          anchor: 0,
        });
      });

      test('sets left side gap cursor selection when user hits left arrow twice', async ({
        editor,
      }) => {
        const { expand } = EditorNodeContainerModel.from(editor);
        const expandModel = EditorExpandModel.from(expand);

        await expand.click({
          position: {
            x: 5,
            y: 5,
          },
        });

        await expandModel.titleInput.click();
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');

        await expect(editor).toHaveSelection({
          type: 'gapcursor',
          side: 'left',
          pos: 0,
        });
      });

      test('sets node selection when user hits right arrow', async ({
        editor,
      }) => {
        const { expand } = EditorNodeContainerModel.from(editor);
        const expandModel = EditorExpandModel.from(expand);

        await expand.click({
          position: {
            x: 5,
            y: 5,
          },
        });

        await expandModel.titleInput.click();
        await editor.keyboard.press('ArrowRight');

        await expect(editor).toHaveSelection({
          type: 'node',
          anchor: 0,
        });
      });

      test('sets right side gap cursor selection when user hits right arrow twice', async ({
        editor,
      }) => {
        const { expand } = EditorNodeContainerModel.from(editor);
        const expandModel = EditorExpandModel.from(expand);

        await expand.click({
          position: {
            x: 5,
            y: 5,
          },
        });

        await expandModel.titleInput.click();
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');

        await expect(editor).toHaveSelection({
          type: 'gapcursor',
          side: 'right',
          pos: 4,
        });
      });
    });
  });

  test.describe('given the focus is in expand title', () => {
    test('sets selection inside expand body when user hits down arrow', async ({
      editor,
    }) => {
      const { expand } = EditorNodeContainerModel.from(editor);
      const expandModel = EditorExpandModel.from(expand);

      await expandModel.titleInput.click();
      await editor.keyboard.press('ArrowDown');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 2,
        head: 2,
      });
    });
  });

  test.describe('given the focus is in expand body', () => {
    test('sets focus inside expand title when user hits up arrow', async ({
      editor,
    }) => {
      // Set selection inside expand paragraph
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await editor.keyboard.press('ArrowUp');
      await editor.keyboard.type('hi');

      await expect(editor).toHaveDocument(
        doc(expand({ title: 'hi', __expanded: true })(p()), p()),
      );
    });

    test.describe('and when the document has a multiline expand', () => {
      test.use({
        adf: multiLineExpandAdf,
      });

      test("doesn't set focus inside expand title when user hits up arrow from second line of expand body", async ({
        editor,
      }) => {
        // set selection at end of second line (there was some flakiness when trying to get this selection by clicking)
        await editor.selection.set({
          anchor: 10,
          head: 10,
        });

        await editor.keyboard.press('ArrowUp');
        await editor.keyboard.type('hi');

        await expect(editor).toHaveDocument(
          doc(expand({})(p('onehi'), p('two'))),
        );
      });
    });

    test.describe('and in code block', () => {
      test.use({
        adf: expandWithNestedCodeBlockTallAdf,
      });

      test('dont jump to expand title when user hits up and down arrow in code block', async ({
        editor,
      }) => {
        // Set selection to the last paragraph in the document
        await editor.selection.set({
          anchor: 18,
          head: 18,
        });

        await editor.keyboard.press('ArrowUp'); // should jump inside expand title
        await editor.keyboard.type('lol'); // inside expand title

        await editor.keyboard.press('ArrowUp');
        await editor.keyboard.press('ArrowUp');
        await editor.keyboard.press('ArrowUp');
        await editor.keyboard.press('ArrowUp');

        await editor.keyboard.type('lol2'); // inside code block last line

        await expect(editor).toHaveDocument(
          doc(
            expand({ __expanded: false })(p()),
            code_block()('\n\n\n\n\n\n\nlol2'),
            expand({ title: 'lol', __expanded: false })(p()),
            p(),
          ),
        );
      });
    });
  });

  test.describe('given the focus is in expand title and the expand is collapsed', () => {
    test.use({
      adf: collapsedExpandAdf,
    });

    test('sets selection below collapsed expand when user hits down arrow', async ({
      editor,
    }) => {
      const { expand } = EditorNodeContainerModel.from(editor);
      const expandModel = EditorExpandModel.from(expand);

      await expandModel.titleInput.click();
      await editor.keyboard.press('ArrowDown');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 5,
      });
    });

    test('sets left side gap cursor selection when user hits up arrow', async ({
      editor,
    }) => {
      const { expand } = EditorNodeContainerModel.from(editor);
      const expandModel = EditorExpandModel.from(expand);

      await expandModel.titleInput.click();
      await editor.keyboard.press('ArrowUp');

      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        side: 'left',
        pos: 0,
      });
    });
  });
});

test.describe('expand: tab navigation', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExpand: true,
    },
  });

  test.use({
    adf: expandAdf,
  });

  test.describe('when tab is pressed and collapsed icon is focused', () => {
    test.describe('and enter is pressed', () => {
      test('should collapse the expand', async ({ editor }) => {
        // Set selection inside expand paragraph
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await test.step('navigating until the gap cursor shows up', async () => {
          await editor.keyboard.press('ArrowLeft');
          await editor.keyboard.press('ArrowLeft');
        });

        await editor.keyboard.press('Tab');
        await editor.keyboard.press('Enter');

        await expect(editor).toHaveDocument(
          doc(expand({ __expanded: false })(p()), p()),
        );
      });
    });

    test.describe('and space is pressed', () => {
      test('should collapse the expand', async ({ editor }) => {
        fixTest({
          jiraIssueId: 'ED-11351',
          reason:
            'Looks like Safari needs special setup for tab navigation stuff: https://product-fabric.atlassian.net/browse/ED-11351',

          browsers: [BROWSERS.webkit],
        });
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await test.step('navigating until the gap cursor shows up', async () => {
          await editor.keyboard.press('ArrowLeft');
          await editor.keyboard.press('ArrowLeft');
        });

        await editor.keyboard.press('Tab');
        await editor.keyboard.press('Space');

        await expect(editor).toHaveDocument(
          doc(expand({ __expanded: false })(p()), p()),
        );
      });
    });
  });

  test.describe('when tab is pressed twice', () => {
    test('should focus on title', async ({ editor }) => {
      fixTest({
        jiraIssueId: 'ED-11351',
        reason:
          'Looks like Safari needs special setup for tab navigation stuff: https://product-fabric.atlassian.net/browse/ED-11351',

        browsers: [BROWSERS.webkit],
      });
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await test.step('navigating until the gap cursor shows up', async () => {
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
      });

      await editor.keyboard.press('Tab');
      await editor.keyboard.press('Tab');

      await editor.keyboard.type('I am here');

      await expect(editor).toHaveDocument(
        doc(expand({ title: 'I am here', __expanded: true })(p()), p()),
      );
    });
  });

  test.describe('when tab is pressed three times', () => {
    test.describe('when expand is opened', () => {
      test('should focus on content', async ({ editor }) => {
        fixTest({
          jiraIssueId: 'ED-11351',
          reason:
            'Looks like Safari needs special setup for tab navigation stuff: https://product-fabric.atlassian.net/browse/ED-11351',

          browsers: [BROWSERS.webkit],
        });
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await test.step('navigating until the gap cursor shows up', async () => {
          await editor.keyboard.press('ArrowLeft');
          await editor.keyboard.press('ArrowLeft');
        });

        await editor.keyboard.press('Tab');
        await editor.keyboard.press('Tab');
        await editor.keyboard.press('Tab');

        await editor.keyboard.type('I am here');

        await expect(editor).toHaveDocument(
          doc(expand({})(p('I am here')), p()),
        );
      });
    });

    test.describe('when expand is closed', () => {
      test.use({
        adf: collapsedExpandAdf,
      });

      test('should focus outside', async ({ editor }) => {
        await editor.selection.set({
          anchor: 5,
          head: 5,
        });

        await test.step('navigating until the gap cursor shows up', async () => {
          await editor.keyboard.press('ArrowLeft');
          await editor.keyboard.press('ArrowLeft');
        });

        await editor.keyboard.press('Tab');
        await editor.keyboard.press('Tab');
        await editor.keyboard.press('Tab');

        await editor.keyboard.type('I am here');

        await expect(editor).toHaveDocument(
          doc(expand({ __expanded: false })(p()), p('I am here')),
        );
      });
    });
  });
});
