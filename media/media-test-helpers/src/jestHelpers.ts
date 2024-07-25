export const asMock = (fn: Function): jest.Mock => fn as jest.Mock;
export const asMockFunction = <T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> =>
	fn as jest.MockedFunction<T>;

export const asMockReturnValue = <T extends (...args: any[]) => any>(
	fn: T,
	returnValue: ReturnType<T>,
) => asMock(fn).mockReturnValue(returnValue);

export const asMockFunctionReturnValue = <T extends (...args: any[]) => any>(
	fn: T,
	returnValue: ReturnType<T>,
) => asMockFunction(fn).mockReturnValue(returnValue);

export const asMockFunctionResolvedValue = <T extends (...args: any[]) => any>(
	fn: T,
	resolveValue: jest.ResolvedValue<ReturnType<T>>,
) => asMockFunction(fn).mockResolvedValue(resolveValue);

export const expectToEqual = <T>(actual: T, expected: T) =>
	// @ts-ignore TS2339: Property `toEqual` does not exist on `typeAssertion`
	// This was added when enrolling `@atlaskit/media-test-helpers` into JFE local consumption
	expect(actual).toEqual(expected);

export type ExpectFunctionToHaveBeenCalledWith = <T extends (...args: any[]) => any>(
	func: T,
	expectedArgs: Parameters<T>,
) => void;
export type ExpectConstructorToHaveBeenCalledWith = <T extends new (...args: any[]) => any>(
	func: T,
	expectedArgs: ConstructorParameters<T>,
) => void;
export const expectConstructorToHaveBeenCalledWith: ExpectConstructorToHaveBeenCalledWith = (
	func,
	expectedArgs,
) =>
	// @ts-ignore TS2339: Property `toHaveBeenCalledWith` does not exist on `typeAssertion`
	// This was added when enrolling `@atlaskit/media-test-helpers` into JFE local consumption
	expect(func).toHaveBeenCalledWith(...expectedArgs);
export const expectFunctionToHaveBeenCalledWith: ExpectFunctionToHaveBeenCalledWith = (
	func,
	expectedArgs,
) =>
	// @ts-ignore TS2339: Property `toHaveBeenCalledWith` does not exist on `typeAssertion`
	// This was added when enrolling `@atlaskit/media-test-helpers` into JFE local consumption
	expect(func).toHaveBeenCalledWith(...expectedArgs);

export type JestSpy<T extends (...args: any) => any> = jest.SpyInstance<
	ReturnType<T>,
	Parameters<T>
>;
export type JestFunction<T extends (...args: any) => any> = jest.Mock<ReturnType<T>, Parameters<T>>;
