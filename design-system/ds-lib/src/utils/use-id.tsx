import React, { forwardRef, type ReactNode, useEffect } from 'react';

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
 * This is an interop function that supports React 16 and 18.
 *
 * If migrating from `useUID` in the `react-uid` package, then `useId` is a direct replacement.
 *
 * @return string
 * @see {@link useIdSeed}
 * @see https://github.com/thearnica/react-uid#hooks-168
 * @example
 *
 * const id = useUID();
 * id == "r1"; // for example
 *
 * Parts of the above are from: https://github.com/thearnica/react-uid/blob/0f507fbbdb1ab84acf477ec32698afe3d2191e49/src/hooks.ts#L41C1-L49C4
 */
export function useId(): string {
	if (react18UseId && fg('platform.design-system-team.react-18-use-id_mn8q4')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		return react18UseId();
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	return `uid${react16UseId()}`;
}

interface IdProviderProps {
	/**
	 * Children to render.
	 * Maybe a function that receives the unique id as an argument.
	 */
	children: ReactNode | ((props: { id: string }) => ReactNode);
	/**
	 * A ref to store an `id` generated by `usedId`
	 */
	ref?: ((id: string) => void) | React.MutableRefObject<string | null> | null;
	/**
	 * A prefix to be added to the generated id.
	 */
	prefix?: string;
	/**
	 * A postfix to be added to the generated id.
	 */
	postfix?: string;
}

/**
 * A wrapper component that allows access to an id generated by useId within a class component.
 *
 * This component is only intended for class components,
 * functional components should use the useId hook directly.
 *
 * @component
 * @param {IdProviderProps['children']} props.children - The child elements to be wrapped.
 *                                                         Can be a function that receives the generated id.
 * @param {IdProviderProps['ref']} [props.ref] - A ref callback to get the instance of the generated id.
 *
 * @example
 * Child as function
 * ```jsx
 * class Example extends React.Component {
 *   render() {
 *     return (
 *       <IdProvider>
 *         {({ id }) => (<div id={id}>Hello</div>)}
 *       </IdProvider>
 *     );
 *   }
 * }
 * ```
 *
 * @example
 * Ref object
 * ```jsx
 * class Example extends React.Component {
 *   readonly useIdRef = React.createRef<string>();
 *   render() {
 *     return (
 *       <IdProvider ref={this.useIdRef}>
 *         <div id={this.useIdRef.current}>Hello</div>
 *       </IdProvider>
 *     );
 *   }
 * }
 *
 * @example
 * Ref as callback
 * ```jsx
 * class Example extends React.Component {
 *   id = '';
 *   setId = (id: string) => {
 *     this.id = id;
 *   };
 *   render() {
 *     return (
 *       <IdProvider ref={this.setId}>
 *         <div id={this.id}>Hello</div>
 *       </IdProvider>
 *     );
 *   }
 * }
 * ```
 */
export const IdProvider = forwardRef<string, IdProviderProps>(
	({ children, postfix = '', prefix = '' }, ref) => {
		const id = `${prefix}${useId()}${postfix}`;

		useEffect(() => {
			if (!ref) {
				return;
			}
			switch (typeof ref) {
				case 'function':
					ref(id);
					break;
				case 'object':
					ref.current = id;
					break;
				default:
					throw new Error(`Unreachable case for unsupported type of ref "${typeof ref}"`);
			}
		}, [id, ref]);

		return typeof children === 'function' ? children({ id }) : children;
	},
);

/**
 * Returns an id generator
 *
 * React 18 SSR and Concurrent modes are supported when the `platform.design-system-team.react-18-use-id_mn8q4` flag is enabled.
 * This is an interop function that supports React 16 and 18.
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
