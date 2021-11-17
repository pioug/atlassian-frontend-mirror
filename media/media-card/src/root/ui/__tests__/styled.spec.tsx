jest.mock('../../../utils/cardDimensions', () => {
  const original = jest.requireActual('../../../utils/cardDimensions');
  return {
    getDefaultCardDimensions: jest.fn(original.getDefaultCardDimensions),
  };
});

import { Breakpoint } from '../common';

import { calcBreakpointSize } from '../styled';

describe('Breakpoint Size', () => {
  it('should calculate the breakpoint size', () => {
    expect(calcBreakpointSize(599)).toBe(Breakpoint.SMALL);
    expect(calcBreakpointSize(600)).toBe(Breakpoint.LARGE);
  });
});
