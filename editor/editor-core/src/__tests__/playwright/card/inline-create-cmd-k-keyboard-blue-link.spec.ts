import type { EditorPageInterface } from '@af/editor-libra';
import {
  editorTestCase as test,
  expect,
  EditorLinkFloatingToolbarModel,
  EditorLinkFloatingToolbarWithNewDesignSystemUIModel,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, doc, a } from '@atlaskit/editor-test-helpers/doc-builder';

// Creating a mockUrl which will be inserted
const mockUrl = 'https://i.want.donuts';

// The original webdriver test was written like this
async function insertLongText(editor: EditorPageInterface): Promise<void> {
  // Inside the editor example.
  await editor.keyboard.type('This');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('is');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('my');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('page');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('with');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('lots');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('of');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('content');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('because');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('I');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('need');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('to');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('test');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('in');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('an');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('editor');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('with');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('lots');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('of');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('content');
  await editor.keyboard.press('Enter');
}
test.describe('card: inserting a link with CMD + K with link not in recents list', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      smartLinks: {
        allowEmbeds: true,
      },
    },
  });
  test('inserted as blue link', async ({ editor }) => {
    await insertLongText(editor);

    const linkToolbarModel = EditorLinkFloatingToolbarModel.from(editor);

    await linkToolbarModel.openViaKeyboardShortcut();
    await editor.keyboard.type(mockUrl);
    await linkToolbarModel.submit();

    await expect(editor).toMatchDocument(
      doc(
        p('This'),
        p('is'),
        p('my'),
        p('page'),
        p('with'),
        p('lots'),
        p('of'),
        p('content'),
        p('because'),
        p('I'),
        p('need'),
        p('to'),
        p('test'),
        p('in'),
        p('an'),
        p('editor'),
        p('with'),
        p('lots'),
        p('of'),
        p('content'),
        p(a({ href: 'https://i.want.donuts' })('https://i.want.donuts')),
      ),
    );
  });
});

test.describe('with feature flag:lp-link-picker, card: inserting a link with CMD + K with link not in recents list ', () => {
  test.use({
    editorProps: {
      featureFlags: {
        'lp-link-picker': true,
      },
      smartLinks: {
        allowEmbeds: true,
      },
    },
    editorMountOptions: {
      withLinkPickerOptions: true,
    },
  });

  test('inserted as blue link', async ({ editor }) => {
    await insertLongText(editor);

    const newLinkToolbarModel =
      EditorLinkFloatingToolbarWithNewDesignSystemUIModel.from(editor);

    await newLinkToolbarModel.openViaKeyboardShortcut();
    await editor.keyboard.type(mockUrl);
    await newLinkToolbarModel.submit();

    await expect(editor).toMatchDocument(
      doc(
        p('This'),
        p('is'),
        p('my'),
        p('page'),
        p('with'),
        p('lots'),
        p('of'),
        p('content'),
        p('because'),
        p('I'),
        p('need'),
        p('to'),
        p('test'),
        p('in'),
        p('an'),
        p('editor'),
        p('with'),
        p('lots'),
        p('of'),
        p('content'),
        p(a({ href: 'https://i.want.donuts' })('https://i.want.donuts')),
      ),
    );
  });
});
