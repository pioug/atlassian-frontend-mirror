import { NumericalCardDimensions } from '@atlaskit/media-common';
import { MediaCardErrorInfo } from '../../utils/analytics';

export type MediaCardSsrData = {
  dataURI?: string;
  dimensions?: Partial<NumericalCardDimensions>;
  error?: MediaCardErrorInfo;
};

export type MediaCardSsr = Record<string, MediaCardSsrData>;
