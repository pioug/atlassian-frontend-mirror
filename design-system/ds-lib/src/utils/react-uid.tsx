import React from 'react';

// eslint-disable-next-line
import { useUID as react16UseId, useUIDSeed as react16UseIdSeed } from 'react-uid';

import { fg } from '@atlaskit/platform-feature-flags';

// Type copied from https://github.com/thearnica/react-uid/blob/0f507fbbdb1ab84acf477ec32698afe3d2191e49/src/hooks.ts#L12
// Copied rather than inferred to make the type transparent
type SeedGenerator = (id: any) => string;

// @ts-ignore - useId is not accessible in React 16
const react18UseId: (() => string) | undefined = React.useId ?? undefined;

/**
 * Returns a unique id
 *
 * React 18 SSR and Concurrent modes are supported when the `platform.design-system-team.react-18-use-id_mn8q4` flag is enabled.
 * This is a interop function that supports React 16 and 18.
 *
 * If migrating from `useUID` in the `react-uid` package, then `useId` is a direct replacement.
 *
 * @return string
 * @see {@link useIdSeed}
 * @see https://github.com/thearnica/react-uid#hooks-168
 * @example
 * const id = useUID();
 * id == 1; // for example
 *
 * Parts of the above are from: https://github.com/thearnica/react-uid/blob/0f507fbbdb1ab84acf477ec32698afe3d2191e49/src/hooks.ts#L41C1-L49C4
 */
export function useId(): string {
	if (react18UseId && fg('platform.design-system-team.react-18-use-id_mn8q4')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		return react18UseId();
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	return react16UseId();
}

/**
 * Returns an id generator
 *
 * React 18 SSR and Concurrent modes are supported when the `platform.design-system-team.react-18-use-id_mn8q4` flag is enabled.
 * This is a interop function that supports React 16 and 18.
 *
 * If migrating from `useUIDSeed` in the `react-uid` package, then `useIdSeed` is a direct replacement.
 *
 * "If you need to give IDs to multiple related elements, you can call useId to generate a shared prefix for them" - From React
 * This function will help to implement the above.
 * @return (id: any) => string
 * @see https://react.dev/reference/react/useId#generating-ids-for-several-related-elements
 * @see https://github.com/thearnica/react-uid#hooks-168
 * @example
 * import { useIdSeed } from '@atlaskit/ds-lib/react-uid';
 *
 * export default function Form() {
 * 	 const idSeed = useIdSeed();
 *   return (
 *     <form>
 *       <label htmlFor={idSeed('firstName')}>First Name:</label>
 *       <input id={idSeed('firstName')} type="text" />
 *       <hr />
 *       <label htmlFor={idSeed('lastName')}>Last Name:</label>
 *       <input id={idSeed('lastName')} type="text" />
 *     </form>
 *   );
 * }
 */
export function useIdSeed(): SeedGenerator {
	if (react18UseId && fg('platform.design-system-team.react-18-use-id_mn8q4')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const uid = react18UseId();
		return (id: any) => `${uid}-${id.toString()}`;
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	return react16UseIdSeed();
}
