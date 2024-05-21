import { Device, snapshot } from '@af/visual-regression';

import { EditorToolbarWithIconBefore } from './toolbar.fixtures';

snapshot(EditorToolbarWithIconBefore, {
  description: 'Toolbar with icon before',
  variants: [
    {
      device: Device.DESKTOP_CHROME,
      name: 'desktop',
    },
    {
      device: Device.MOBILE_CHROME,
      name: 'mobile',
    },
  ],
});
