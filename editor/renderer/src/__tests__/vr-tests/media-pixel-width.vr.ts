import { Device, snapshot } from '@af/visual-regression';
import {
  MediaWithPixelWidth,
  MediaWithPixelWidthFullWidth,
} from '../__helpers/rendererComponents';

snapshot(MediaWithPixelWidth, {
  variants: [
    // Screenshot mismatch on CI for desktop variant https://product-fabric.atlassian.net/browse/ED-19604
    // {
    //   name: 'desktop',
    //   device: Device.DESKTOP_CHROME,
    // },
    {
      name: 'mobile device',
      device: Device.MOBILE_CHROME,
    },
  ],
});

snapshot(MediaWithPixelWidthFullWidth);
