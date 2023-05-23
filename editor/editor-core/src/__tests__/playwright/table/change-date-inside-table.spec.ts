import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  EditorNodeContainerModel,
  EditorDateModel,
  EditorPopupModel,
  editorTestCase as test,
  expect,
} from '@atlaskit/editor-test-helpers/playwright';
import {
  doc,
  table,
  tr,
  th,
  tdEmpty,
  thEmpty,
  date,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowDate: true,
    allowTables: {
      advanced: true,
    },
  },
});

test.describe('when there is a date inside a table', () => {
  const simpleTableWithDate = doc(
    table({ localId: 'localId' })(
      tr(th()(p(date({ timestamp: '1684454400000' }), ' ')), thEmpty, thEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty),
    ),
  )(sampleSchema).toJSON();
  test.use({
    adf: simpleTableWithDate,
  });

  test('should change the date content', async ({ editor }) => {
    const popupModel = EditorPopupModel.from(editor);
    const nodes = EditorNodeContainerModel.from(editor);
    const dateModel = EditorDateModel.from(nodes.table.locator(nodes.date));

    const calendar = await dateModel.openCalendar(popupModel);
    await calendar.clickAtNextDay();

    await expect(editor).toHaveDocument(
      doc(
        table({ localId: 'localId' })(
          tr(
            th()(p(date({ timestamp: '1684540800000' }), ' ')),
            thEmpty,
            thEmpty,
          ),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );
  });
});
