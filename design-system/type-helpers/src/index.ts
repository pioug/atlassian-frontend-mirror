import React from 'react';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Shared<A, B> = {
  [P in Extract<keyof A, keyof B>]?: A[P] extends B[P] ? B[P] : never;
} &
  { [P in Extract<keyof B, keyof A>]?: B[P] extends A[P] ? A[P] : never };

/**
 * Extract the type of "P" for a given React component
 */
export type PropsOf<C> = C extends new (props: infer P) => React.Component
  ? P
  : C extends (props: infer P) => React.ReactElement<any> | null
  ? P
  : C extends React.Component<infer P>
  ? P
  : never;

export const withDefaultProps = <P, DP extends Partial<P>>(
  defaultProps: DP,
  Component: React.ComponentType<P>,
) => {
  type NonDefaultProps = Omit<P, keyof Shared<P, DP>>;
  type DefaultedProps = Omit<P, keyof NonDefaultProps>;
  type Props = Partial<DefaultedProps> & NonDefaultProps;
  Component.defaultProps = defaultProps;
  return (Component as any) as React.ComponentType<Props>;
};

export type ResultantProps<InjectedProps, P extends InjectedProps> = Omit<
  P,
  keyof InjectedProps
>;

/**
 * This type is used for HOC's that do not inject any props rather just render
 * the component in a special way.  The resultant component can take in additional
 * props.
 *
 * Example usage:
 *
 * const withDeprecationWarnings: PropsPasser<AppearanceProps> = (
 *  Component,
 * ) => {
 *   return class WithDeprecationWarnings extends React.Component<PropsOf<typeof Component> & AppearanceProps> {
 *     static displayName = `WithDeprecationWarnings(${getComponentName(
 *       Component,
 *     )})`;
 *
 *     UNSAFE_componentWillMount() {
 *       warnIfDeprecatedAppearance(this.props.appearance);
 *     }
 *
 *     UNSAFE_componentWillReceiveProps(newProps: AppearanceProps) {
 *       if (newProps.appearance !== this.props.appearance) {
 *         warnIfDeprecatedAppearance(newProps.appearance);
 *       }
 *     }
 *
 *     render() {
 *       return React.createElement(Component, this.props as any);
 *     }
 *   };
 * };
 */
export type PropsPasser<Extra extends object = {}> = <
  C extends React.ComponentClass
>(
  Component: C,
) => React.ComponentClass<PropsOf<C> & Extra>;

/**
 * Sometimes we want to utilse the power of Algebraic Data Types.
 * Meaning, ADTs behave similarly to algebra:
 *  - (a + b) * c === a * c + b * c
 *  - (A | B) & T === (A & T) | (B & T).
 *
 * As such, if I have props for my component as a
 * Sum type (also called variants), like this:
 *
 *  type Props = {a: number} | {b: string}
 *
 * and I want to build up NewProps by mixing-in:
 *
 *  type NewProps
 *    = Props & { data: bool }
 *    === ({a: number} & { data: bool } ) | ( {b: string} & { data: bool } )
 */
export type SumPropsInjector<InjectedProps extends object> = <
  C extends React.ComponentClass<any>
>(
  Component: C,
) => React.ComponentClass<PropsOf<C> & InjectedProps>;

/**
 * Returns a type with keys that are not in T and U set to never.
 * For example:
 * ```
 * interface T {
 *    foo: string;
 * }
 * interface U {
 *    foo: string;
 *    bar: string;
 * }
 * type Result = Without<T, U>;
 * // Result === { bar?: never };
 * ```
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * Returns type that accepts either one of two provided types.
 * For example:
 * ```
 * interface T{
 *   foo: string;
 * }
 * interface U{
 *   bar: string;
 * }
 * type OneOfTwo = XOR<T, U>
 *
 * const one: OneOfTwo = {foo: "hello"};
 * const two: OneOfTwo = {bar: "hello"};
 *
 * const error: OneOfTwo = {foo: "hello", bar: "hello"}; // Throws an error
 *
 * console.log(one.foo); // OK
 * console.log(one.bar); // ERROR
 * console.log(two.bar); // OK
 * console.log(two.foo); // ERROR
 * ```
 *
 * But! There is a catch.
 * ```
 * function(oneOrTwo: OneOrTwo) {
 *   console.log(oneOrTwo.foo); // OK
 *   console.log(oneOrTwo.bar); // OK
 * }
 * ```
 * This is somewhat buggy in that context, so you should be careful reading values checking them
 * manually first.
 *
 */
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
