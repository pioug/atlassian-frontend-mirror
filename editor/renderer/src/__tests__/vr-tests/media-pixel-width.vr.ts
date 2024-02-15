import { Device, snapshot } from '@af/visual-regression';
import {
  MediaWithPixelWidth,
  MediaWithPixelWidthFullWidth,
} from '../__helpers/rendererComponents';

snapshot(MediaWithPixelWidth, {
  variants: [
    {
      name: 'desktop',
      device: Device.DESKTOP_CHROME,
    },
    {
      name: 'mobile device',
      device: Device.MOBILE_CHROME,
    },
  ],
});

snapshot(MediaWithPixelWidthFullWidth);
