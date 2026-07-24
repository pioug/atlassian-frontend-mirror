// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { SerializedStyles } from '@emotion/serialize';

import type { StrictXCSSProp, XCSSAllProperties, XCSSAllPseudos } from '@atlaskit/css';

import { uniqueSymbol } from './unique-symbol';
import { type XCSS } from './xcss';

/**
 * Picks out runtime XCSS objects and build-time XCSS strings. This is needed
 * to supported both Emotion and Compiled styles until we've fully migrated
 * to Compiled.
 *
 * @private
 * @deprecated
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const parseXcss = (
	args:
		| XCSS
		| (XCSS | false | undefined)[]
		| undefined
		| StrictXCSSProp<XCSSAllProperties, XCSSAllPseudos>,
): { emotion?: SerializedStyles[]; static?: string } => {
	if (Array.isArray(args)) {
		const emotion: SerializedStyles[] = [];
		const staticArr: string[] = [];

		for (const arg of args) {
			const result = parseXcss(arg);

			if (result.emotion) {
				emotion.push(...result.emotion);
			}

			if (result.static) {
				staticArr.push(result.static);
			}
		}

		return {
			emotion,
			static: staticArr.join(' '),
		};
	}

	const objArgs = args as XCSS | undefined;
	const { [uniqueSymbol]: styles } = objArgs || {};

	if (styles) {
		return { emotion: [styles] };
	}

	if (args) {
		// We use string interpolation here instead of .toString() just
		// in case the resulting object doesn't have the method available.
		const stringifiedArgs = `${args}`;
		if (stringifiedArgs) {
			return { static: stringifiedArgs };
		}
	}

	return {};
};
