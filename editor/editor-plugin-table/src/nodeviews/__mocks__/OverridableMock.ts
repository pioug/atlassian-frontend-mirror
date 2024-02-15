export abstract class OverridableMock {
  static mockOverrides: { [key: string]: any } = {};

  constructor(...inputs: any[]) {
    const constructorMock =
      OverridableMock.mockOverrides['constructor'] || jest.fn();
    constructorMock(...inputs);
  }

  getMock(key: string) {
    return OverridableMock.mockOverrides[key] || jest.fn();
  }

  static setMock(thisKey: string, value: any) {
    OverridableMock.mockOverrides[thisKey] = value;
  }

  static resetMocks() {
    OverridableMock.mockOverrides = {};
  }
}
