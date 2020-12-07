import { getBridge } from '../../bridge-initialiser';

describe('Bridge Initialiser', () => {
  beforeEach(() => {
    window.bridge = undefined;
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set the window bridge when new bridge is instantiated', () => {
    const bridge = getBridge();
    expect(window.bridge).not.toBeUndefined();
    expect(window.bridge).toEqual(bridge);
  });

  it('should return the same bridge if it is intialised already', () => {
    const bridge1 = getBridge();
    const bridge2 = getBridge();
    expect(bridge1).toEqual(bridge2);
  });
});
