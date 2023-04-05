import type { ProductInformation } from '../types';

export const createLogger =
  (prefix: string, color: string = 'blue') =>
  (msg: string, data: any = null) => {
    if ((window as any).COLLAB_PROVIDER_LOGGER) {
      // eslint-disable-next-line no-console
      console.log(
        `%cCollab-${prefix}: ${msg}`,
        `color: ${color}; font-weight: bold`,
        data,
      );
    }
  };

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const getProduct = (productInfo?: ProductInformation): string =>
  productInfo?.product ?? 'unknown';

export const getSubProduct = (productInfo?: ProductInformation): string =>
  productInfo?.subProduct ?? (!!productInfo?.product ? 'none' : 'unknown');
