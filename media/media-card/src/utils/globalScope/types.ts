import { type NumericalCardDimensions } from '@atlaskit/media-common';
import { type MediaCardErrorInfo } from '../../utils/analytics';

export type MediaCardSsrData = {
  dataURI?: string;
  dimensions?: Partial<NumericalCardDimensions>;
  error?: MediaCardErrorInfo;
};

export type MediaCardSsr = Record<string, MediaCardSsrData>;
