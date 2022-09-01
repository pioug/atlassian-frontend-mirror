import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '../../../../__tests__/__helpers/page-objects/_toolbar';
import { runEscapeKeydownSuite } from '../../../../__tests__/integration/escape-keydown/__helpers';

runEscapeKeydownSuite({
  openMenu: async (page) => {
    await clickToolbarMenu(page, ToolbarMenuItem.fontStyle);
  },
});
