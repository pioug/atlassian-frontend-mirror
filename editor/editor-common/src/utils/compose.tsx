/** Helper type for single arg function */
type Func<A, B> = (a: A) => B;

/**
 * Compose 1 to n functions.
 * @param func first function
 * @param funcs additional functions
 */
export function compose<
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	F1 extends Func<any, any>,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	FN extends Array<Func<any, any>>,
	R extends FN extends []
		? F1
		: // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			FN extends [Func<infer A, any>]
			? (a: A) => ReturnType<F1>
			: // Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				FN extends [any, Func<infer A, any>]
				? (a: A) => ReturnType<F1>
				: // Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					FN extends [any, any, Func<infer A, any>]
					? (a: A) => ReturnType<F1>
					: // Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						FN extends [any, any, any, Func<infer A, any>]
						? (a: A) => ReturnType<F1>
						: // Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							FN extends [any, any, any, any, Func<infer A, any>]
							? (a: A) => ReturnType<F1>
							: // Ignored via go/ees005
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								Func<any, ReturnType<F1>>, // Doubtful we'd ever want to pipe this many functions, but in the off chance someone does, we can still infer the return type
>(func: F1, ...funcs: FN): R {
	const allFuncs = [func, ...funcs];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function composed(raw: any) {
		return allFuncs.reduceRight((memo, func) => func(memo), raw);
	} as R;
}
