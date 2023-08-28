import { Device, snapshot } from '@af/visual-regression';
import {
  MediaWithPixelWidth,
  MediaWithPixelWidthFullWidth,
} from '../__helpers/rendererComponents';

// FIXME: Screenshot mismatch on CI https://product-fabric.atlassian.net/browse/ED-19604
snapshot.skip(MediaWithPixelWidth, {
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

// FIXME: Screenshot mismatch on CI https://product-fabric.atlassian.net/browse/ED-19604
snapshot.skip(MediaWithPixelWidthFullWidth);
