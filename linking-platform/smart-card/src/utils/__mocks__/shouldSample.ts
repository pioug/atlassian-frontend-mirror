export const shouldSample = jest.fn().mockReturnValue(true);

beforeEach(() => {
	shouldSample.mockReturnValue(true);
});
