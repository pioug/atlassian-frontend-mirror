export const mockLogger = () => ({
  safeError: jest.fn(),
  safeInfo: jest.fn(),
  safeWarn: jest.fn(),
  reset() {
    this.safeError.mockReset();
    this.safeInfo.mockReset();
    this.safeWarn.mockReset();
  },
});
