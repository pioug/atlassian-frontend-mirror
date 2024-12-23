export abstract class OverridableMock {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static mockOverrides: { [key: string]: any } = {};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(...inputs: any[]) {
		const constructorMock = OverridableMock.mockOverrides['constructor'] || jest.fn();
		constructorMock(...inputs);
	}

	getMock(key: string) {
		return OverridableMock.mockOverrides[key] || jest.fn();
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static setMock(thisKey: string, value: any) {
		OverridableMock.mockOverrides[thisKey] = value;
	}

	static resetMocks() {
		OverridableMock.mockOverrides = {};
	}
}
