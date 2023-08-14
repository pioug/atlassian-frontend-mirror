import { runEscapeKeydownSuite } from '@atlaskit/editor-test-helpers/integration/escape-keydown';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';

runEscapeKeydownSuite({
  openMenu: async page => {
    await clickToolbarMenu(page, ToolbarMenuItem.fontStyle);
  },
});
