import { _getCopyButtonTestSuite } from '../../../../../src/__tests__/integration/copy-button/_getCopyButtonTestSuite';
import fullWidthExtensionADF from '../visual-regression/__fixtures__/full-width-extension-inside-bodied-extension.adf.json';

_getCopyButtonTestSuite({
  nodeName: 'Extension',
  editorOptions: {
    allowExtension: true,
    defaultValue: fullWidthExtensionADF,
  },
  nodeSelector: '.extension-title',
});
