import { MockImage } from './globalImageMock/MockImage';
import { mockGlobalImageState } from './globalImageMock/mockGlobalImageState';

declare var global: any;

export function enableMockGlobalImage(isError: boolean = false): void {
	global.Image = MockImage;
	mockGlobalImageState.isErrorInsteadOfLoad = isError;
}
