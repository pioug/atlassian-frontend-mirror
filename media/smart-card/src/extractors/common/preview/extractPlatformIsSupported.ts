import { JsonLd } from 'json-ld-types';
import { CardPlatform } from '../../../view/Card/types';

export const extractPlatformIsSupported = (
  preview: JsonLd.Data.BaseData['preview'],
  platform?: CardPlatform,
): boolean | undefined => {
  if (preview) {
    // By default, we support previews everywhere.
    if (typeof preview === 'string') {
      return true;
    } else {
      const supportedPlatforms = preview['atlassian:supportedPlatforms'];
      if (supportedPlatforms) {
        const isWeb = platform === 'web';
        return (
          (isWeb && supportedPlatforms.includes('web')) ||
          (!isWeb && supportedPlatforms.includes('mobile'))
        );
      }
      // No supported platforms - assume they are all supported.
      return true;
    }
  }

  // No preview, don't try and render it on any platforms.
  return false;
};
