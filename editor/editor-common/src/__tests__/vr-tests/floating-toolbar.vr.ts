import { snapshot } from '@af/visual-regression';

import {
  HyperlinkFloatingToolbar,
  HyperlinkFloatingToolbarDeprecated,
  HyperlinkFloatingToolbarEmpty,
} from './floating-toolbar.fixtures';

snapshot(HyperlinkFloatingToolbar);

snapshot(HyperlinkFloatingToolbarEmpty);

snapshot(HyperlinkFloatingToolbarDeprecated);
