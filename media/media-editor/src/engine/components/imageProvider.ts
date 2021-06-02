import { Component } from './component';
import { isImageRemote } from '@atlaskit/media-client';

export interface ImageProvider extends Component {
  readonly backImage: HTMLImageElement;
  readonly backImageUuid: string;

  readonly supplementaryCanvas: HTMLCanvasElement;
}

export type ImageLoader = () => Promise<HTMLImageElement>; // the editor should be able to read the data of this image

export const urlImageLoader = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img') as HTMLImageElement;

    // For more details: https://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html
    if (isImageRemote(url)) {
      img.crossOrigin = '';
    }
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error(`Can't load image with url: ${url}`));
    };
    img.src = url;
  });
};

export class DefaultImageProvider implements ImageProvider {
  public static create(
    imageLoader: ImageLoader,
    supplementaryCanvas: HTMLCanvasElement,
  ): Promise<DefaultImageProvider> {
    return imageLoader().then(
      (img) => new DefaultImageProvider(img, supplementaryCanvas),
    );
  }

  private constructor(
    public readonly backImage: HTMLImageElement,
    public readonly supplementaryCanvas: HTMLCanvasElement,
  ) {}

  get backImageUuid(): string {
    return 'default';
  }

  unload(): void {}
}
