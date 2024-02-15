import { Device, snapshot } from '@af/visual-regression';
import {
  MediaImageInlineDefault,
  MediaImageInlineError,
  MediaImageInlineWithBorders,
  MediaImageInlineWithLinks,
  MediaImageInlineWithLinksAndBorders,
} from '../__helpers/rendererComponents';

snapshot(MediaImageInlineDefault, {
  variants: [
    {
      name: 'desktop',
      device: Device.DESKTOP_CHROME,
    },
  ],
  featureFlags: {
    'platform.editor.media.inline-image.base-support': true,
    'platform.media-experience.cardv2_7zann': true,
  },
});

snapshot(MediaImageInlineError, {
  variants: [
    {
      name: 'desktop',
      device: Device.DESKTOP_CHROME,
    },
  ],
  featureFlags: {
    'platform.editor.media.inline-image.base-support': true,
  },
});

snapshot(MediaImageInlineWithBorders, {
  variants: [
    {
      name: 'desktop',
      device: Device.DESKTOP_CHROME,
    },
  ],
  featureFlags: {
    'platform.editor.media.inline-image.base-support': true,
    'platform.media-experience.cardv2_7zann': true,
  },
});

snapshot(MediaImageInlineWithLinks, {
  variants: [
    {
      name: 'desktop',
      device: Device.DESKTOP_CHROME,
    },
  ],
  featureFlags: {
    'platform.editor.media.inline-image.base-support': true,
    'platform.media-experience.cardv2_7zann': true,
  },
});

snapshot(MediaImageInlineWithLinksAndBorders, {
  variants: [
    {
      name: 'desktop',
      device: Device.DESKTOP_CHROME,
    },
  ],
  featureFlags: {
    'platform.editor.media.inline-image.base-support': true,
    'platform.media-experience.cardv2_7zann': true,
  },
});
