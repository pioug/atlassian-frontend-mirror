import {
  ProviderFactory,
  ProviderName,
} from '@atlaskit/editor-common/provider-factory';

export const isVisualRegression = () => !!process.env.VISUAL_REGRESSION;

export const waitForProvider = (providerFactory: ProviderFactory) => (
  providerName: ProviderName,
) =>
  new Promise((resolve) => {
    const handler = (name: string, provider: any) => {
      if (providerName === name) {
        providerFactory.unsubscribe(providerName, handler);
        resolve(provider);
      }
    };
    providerFactory.subscribe(providerName, handler);
  });

export const flushPromises = () =>
  new Promise((resolve) => setImmediate(resolve));

interface BoundingRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function calcUserDragAndDropFromMidPoint(
  boundingRect: BoundingRect,
  padding: number = 5,
): [number, number, number, number] {
  return [
    boundingRect.left + boundingRect.width * 0.5,
    boundingRect.top + boundingRect.height * 0.5,
    boundingRect.left + padding,
    boundingRect.top + padding,
  ];
}
