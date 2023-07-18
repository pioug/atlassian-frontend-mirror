import { Device, snapshot } from '@af/visual-regression';
import {
  MediaWithPixelWidthFullWidthNested,
  MediaWithPixelWidthNested,
} from '../__helpers/rendererComponents';

snapshot(MediaWithPixelWidthNested, {
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

snapshot(MediaWithPixelWidthFullWidthNested);
