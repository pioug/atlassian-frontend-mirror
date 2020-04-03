import {
  clipboardApiSupported,
  copyToClipboardLegacy,
  ieClipboardApiSupported,
  copyToClipboard,
  copyToClipboardIE,
} from '../../../../react/nodes/copy-text-provider';

describe('Renderer - clipboard utils', () => {
  describe('clipboardApiSupported', () => {
    const oldClipboard = navigator.clipboard;
    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {},
        writable: true,
      });
    });

    afterAll(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: oldClipboard,
      });
    });

    it('returns false when clipboard is defined but writeText is not a function', () => {
      delete navigator.clipboard.writeText;
      expect(clipboardApiSupported()).toEqual(false);
    });

    it('returns true when clipboard.writeText is defined', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: (_s: string) => Promise.resolve(),
        },
      });
      expect(clipboardApiSupported()).toEqual(true);
    });
  });

  describe('copyToClipboardIE', () => {
    beforeEach(() => {
      if (!(window as any).clipboardData) {
        Object.defineProperty(window, 'clipboardData', {
          value: {
            setData: jest.fn(),
          },
        });
      }
    });

    afterAll(() => {
      delete (window as any).clipboardData;
    });

    it('returns true when clipboardData exists', () => {
      expect(ieClipboardApiSupported()).toEqual(true);
    });

    it('returns false when clipboardData does not exists', () => {
      delete (window as any).clipboardData;
      expect(ieClipboardApiSupported()).toEqual(true);
    });

    it('returns true when copy is successful', () => {
      expect(copyToClipboardIE('test')).resolves.toEqual(undefined);
    });
  });

  describe('copyToClipboardLegacy', () => {
    const oldCxecCommand = document.execCommand;
    const copyArea = document.createElement('div');

    afterEach(() => {
      document.execCommand = oldCxecCommand;
    });

    it('promise rejected when copy area is not defined', () => {
      expect(copyToClipboardLegacy('test', null)).rejects.toEqual(
        'Copy area reference is not defined',
      );
    });

    it('promise rejected when document.execCommand returns false', () => {
      document.execCommand = jest.fn(() => false);
      expect(copyToClipboardLegacy('test', copyArea)).rejects.toEqual(
        'Failed to copy',
      );
    });

    it('promise resolved when document.execCommand returns true', () => {
      document.execCommand = jest.fn(() => true);
      expect(copyToClipboardLegacy('test', copyArea)).resolves.toEqual(
        undefined,
      );
    });
  });

  describe('copyToClipboard', () => {
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
      copyToClipboard('test clipboard.writeText');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'test clipboard.writeText',
      );
    });

    it('returns true when clipboard.writeText is defined', () => {
      delete navigator.clipboard.writeText;
      expect(copyToClipboard('test')).rejects.toEqual(
        'Clipboard api is not supported',
      );
    });
  });
});
