import { editorTestCase } from '@af/editor-libra';
import { simpleTable } from './__fixtures__/base-adfs';

editorTestCase.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
  adf: simpleTable,
});

/**
 * this test need to be implement after we have clearly definition of merged cells and what scenairo it should be disable and when is not.
 * and hasMergedCell may need to be update up to this feature
 * ticket: https://product-fabric.atlassian.net/browse/ED-20849
 * initial feature ticket: https://product-fabric.atlassian.net/browse/ED-20480
 */
editorTestCase.describe('when talbe has merged cells', () => {
  //         Col1  Col2  Col3  Col4
  //       +--+--+--+--+--+--+--+--+
  //  Row1 |  a  |  b  |  c  |  d  |
  //       +--+--+--+--+--+--+--+--+
  //  Row2 |  e  |  f  |  g  |     |
  //       +--+--+--+--+--+--+  h  +
  //  Row3 |  i  |  j  |  k  |     |
  //       +--+--+--+--+--+--+--+--+
  //  editorTestCase.todo('Row 2 and Row 3 handle should be disabled when hoverred', async () => {});
  //  editorTestCase.todo('Col 4 handle should be disabled when hoverred', async () => {});
  //  editorTestCase.todo('should show disabled icon in drag handle', async () => {});
});
