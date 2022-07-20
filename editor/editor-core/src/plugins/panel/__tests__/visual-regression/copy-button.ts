import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/visual-regression/_getCopyButtonTestSuite';
import { panelSelectors } from '../../../../__tests__/__helpers/page-objects/_panel';
import panelAdf from '../__fixtures__/basic-panel-adf.json';

_getCopyButtonTestSuite({
  nodeName: 'Panel',
  editorOptions: { allowPanel: true, defaultValue: panelAdf },
  nodeSelector: panelSelectors.panelContent,
});
