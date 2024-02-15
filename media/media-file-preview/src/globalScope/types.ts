import { NumericalCardDimensions } from '@atlaskit/media-common';

import { MediaFilePreviewErrorInfo } from '../analytics';

export type MediaCardSsrData = {
  dataURI?: string;
  dimensions?: Partial<NumericalCardDimensions>;
  error?: MediaFilePreviewErrorInfo;
};

export type MediaCardSsr = Record<string, MediaCardSsrData>;
