/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
jest.mock('../../mounter', () => {
	return {
		Mounter: () => {
			return null;
		},
	};
});

// Using doMock here instead of jest.mock to allow us to reference Range without the mock prefix
jest.doMock('../../../contexts/AnnotationRangeContext', () => {
	return {
		useAnnotationRangeState: () => {
			return {
				range: new Range(),
				type: 'hover',
			};
		},
		useAnnotationRangeDispatch: () => {
			return {
				clearRange: () => {},
				clearSelectionRange: () => {},
				clearHoverRange: () => {},
				setRange: () => {},
				setHoverTarget: () => {},
			};
		},
	};
});

// Required to denote this as a module for typechecking purposes
export {};
