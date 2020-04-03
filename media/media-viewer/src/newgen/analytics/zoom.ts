import { GasPayload } from '@atlaskit/analytics-gas-types';
import { packageAttributes, PackageAttributes } from './index';

export type ZoomType = 'zoomOut' | 'zoomIn';
export interface ZoomControlsGasPayload extends GasPayload {
  attributes: PackageAttributes & {
    zoomScale: number;
  };
}

export function createZoomEvent(
  zoomType: ZoomType,
  zoomScale: number,
): ZoomControlsGasPayload {
  return {
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: zoomType,
    attributes: {
      zoomScale,
      ...packageAttributes,
    },
  };
}
