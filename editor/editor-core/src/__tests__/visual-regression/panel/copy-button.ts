import { _getCopyButtonTestSuite } from '../copy-button/_getCopyButtonTestSuite';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { panelSelectors } from '@atlaskit/editor-test-helpers/page-objects/panel';
import panelAdf from '../../__fixtures__/panel/basic-panel-adf.json';

_getCopyButtonTestSuite({
  nodeName: 'Panel',
  editorOptions: { allowPanel: true, defaultValue: panelAdf },
  nodeSelector: panelSelectors.panelContent,
});
