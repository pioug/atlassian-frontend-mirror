// Mock the bare minimum of jest used within `media-test-helpers`.
// Ideally this is not required in the future when functions are no longer used in Examples

// as they should only be used in unit tests.
interface MockedJest<F, S> {
	fn: (value?: F) => MockStub<F, F>;
	spyOn: () => MockStub<S, S>;
	genMockFromModule: undefined;
	requireActual: () => void;
	doMock: () => void;
}

type MockFunction<T> = <T>(value?: T) => void;

export interface MockStub<T, R> extends MockFunction<T> {
	mockReturnValue: (value: T) => R;
	mockImplementation: (value: T) => R;
	mockResolvedValue: (value: T) => R;
}

const mockStub = <T>(): MockStub<T, void> =>
	Object.assign(() => {}, {
		mockReturnValue(value?: T) {},
		mockImplementation(value?: T) {},
		mockResolvedValue(value?: T) {},
	});

const mockJest = <F, S>(): MockedJest<F, S> => {
	if (process.env.NODE_ENV !== 'development') {
		// eslint-disable-next-line no-console
		console.warn(
			'Using mock jest. Please remove references to media-test-helpers in non-test code.',
		);
	}

	return {
		fn: (value?: F) => mockStub<F>() as MockStub<F, F>,
		spyOn: () => mockStub<S>() as MockStub<S, S>,
		genMockFromModule: undefined,
		requireActual: () => {},
		doMock: () => {},
	};
};

// ED-15806 Required as some examples currently use test modules and complain about not having `jest`.
export default <F, S>() => (typeof jest === 'undefined' ? mockJest<F, S>() : jest);
