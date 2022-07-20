import { copyTextToClipboard } from '../../../react/utils/clipboard';

describe('Renderer - clipboard utils', () => {
  describe('copyTextToClipboard', () => {
    const oldClipboard = navigator.clipboard;
    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: jest.fn((_s: string) => Promise.resolve()),
        },
        writable: true,
      });
    });

    afterAll(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: oldClipboard,
      });
    });

    it('calls native clipboard.writeText', () => {
      copyTextToClipboard('test clipboard.writeText');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'test clipboard.writeText',
      );
    });

    it('returns false when clipboard is defined but writeText is not a function', () => {
      // @ts-expect-error
      navigator.clipboard.writeText = true;
      expect(copyTextToClipboard('test')).rejects.toEqual(
        'Clipboard API is not supported',
      );
    });

    it('returns true when clipboard.writeText is defined', () => {
      // @ts-ignore
      delete navigator.clipboard.writeText;
      expect(copyTextToClipboard('test')).rejects.toEqual(
        'Clipboard API is not supported',
      );
    });
  });
});
