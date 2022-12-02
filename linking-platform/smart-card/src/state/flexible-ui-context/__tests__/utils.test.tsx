import { MediaType } from '../../../constants';
import { FlexibleUiDataContext } from '../types';
import { isFlexUiPreviewPresent } from '../utils';

describe('tests isFlexUiPreviewPresent() function', () => {
  const contextWithPreview: FlexibleUiDataContext = {
    preview: {
      type: MediaType.Image,
      url: 'some.url',
    },
  };

  it('should return true when preview is present', () => {
    expect(isFlexUiPreviewPresent(contextWithPreview)).toBe(true);
  });

  it('should return false when context is undefined', () => {
    expect(isFlexUiPreviewPresent(undefined)).toBe(false);
  });

  it('should return false when preview is undefined', () => {
    expect(isFlexUiPreviewPresent({})).toBe(false);
  });
});
