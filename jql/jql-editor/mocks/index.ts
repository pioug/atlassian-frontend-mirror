import { createIntl } from 'react-intl-next';

export const mockIntl = createIntl({ locale: 'en' });

// Mock document.createRange used to manage selections in prosemirror-view
export const mockCreateRange = () => {
  const range = new Range();

  range.getBoundingClientRect = () => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: jest.fn(),
  });

  range.getClientRects = () => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: jest.fn(),
    };
  };

  return range;
};
