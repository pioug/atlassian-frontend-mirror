import { mockGlobalImageState } from './globalImageMock/mockGlobalImageState';
import { MockImage } from './globalImageMock/MockImage';

declare var global: any;

export function enableMockGlobalImage(isError: boolean = false): void {
	global.Image = MockImage;
	mockGlobalImageState.isErrorInsteadOfLoad = isError;
}
