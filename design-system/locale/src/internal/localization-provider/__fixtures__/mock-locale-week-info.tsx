const NativeLocale = Intl.Locale;

/**
 * Emulates browser API availability while retaining real Intl locale parsing
 * and regional data. Restore Jest mocks after each test.
 */
export const mockLocaleWeekInfo = (support: 'method' | 'getter' | 'none'): jest.SpyInstance =>
	jest.spyOn(Intl, 'Locale').mockImplementation(
		(tag) =>
			new Proxy(new NativeLocale(tag), {
				get(target, property) {
					if (property === 'getWeekInfo' && support !== 'method') {
						return undefined;
					}
					if (property === 'weekInfo') {
						if (support === 'method') {
							throw new Error('The legacy getter must not be read when getWeekInfo exists');
						}
						return support === 'getter' ? target.getWeekInfo() : undefined;
					}
					// Intl accessors and methods require a receiver with native internal slots.
					const value = Reflect.get(target, property, target);
					return typeof value === 'function' ? value.bind(target) : value;
				},
			}),
	);
