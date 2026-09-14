import { globalImage } from './globalImageMock/globalImage';

declare var global: any;

export function disableMockGlobalImage(): void {
	global.Image = globalImage;
}
