export const shouldSample: jest.Mock<any, any, any> = jest.fn().mockReturnValue(true);

beforeEach(() => {
	shouldSample.mockReturnValue(true);
});
