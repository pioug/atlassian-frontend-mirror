if (typeof jest === 'undefined') {
  // We need to do this since jest is not defined on browser integration tests
  (global as any).jest = {
    fn: () => ({
      mockReturnValue() {},
      mockImplementation() {},
      mockResolvedValue() {},
    }),
    spyOn: () => ({ mockImplementation() {} }),
  };
}
