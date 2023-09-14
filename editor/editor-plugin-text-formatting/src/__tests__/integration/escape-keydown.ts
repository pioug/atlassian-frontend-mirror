// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runEscapeKeydownSuite } from '@atlaskit/editor-test-helpers/integration/escape-keydown';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';

runEscapeKeydownSuite({
  openMenu: async page => {
    await clickToolbarMenu(page, ToolbarMenuItem.fontStyle);
  },
});
