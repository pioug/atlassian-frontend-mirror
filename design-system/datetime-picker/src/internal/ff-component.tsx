import React, {
	type ComponentRef,
	type ComponentType,
	type FC,
	forwardRef,
	type PropsWithoutRef,
	type PropsWithRef,
	type RefAttributes,
} from 'react';

/**
 * Gets all available ref types from two prop sets and returns
 * them in a ref prop
 *
 * @example
 * ```
 * type P1 = { ref: Ref(HTMLDivElement), ... };
 * type P2 = { ref: Ref(HTMLSpanElement), ... };
 *
 * GetRefAttributes(P1, P2) // {ref: Ref(HTMLDivElement | HTMLSpanElement)}
 * ```
 */
type GetRefAttributes<A, B> =
	A extends RefAttributes<infer RefA>
		? B extends RefAttributes<infer RefB>
			? RefAttributes<RefA | RefB>
			: RefAttributes<RefA>
		: B extends RefAttributes<infer OnlyRefB>
			? RefAttributes<OnlyRefB>
			: unknown;

/**
 * Returns one of components depending on a boolean condition.
 * The result component will be a union of the two props and
 * an or on both ref types.
 *
 * @example
 * ```
 * const Component = componentWithCondition(
 *      isBooleanConditionMet,
 *      ComponentWithConditionMet,
 *      ComponentWithConditionNotMet,
 * );
 *
 * @param condition Function returning boolean value
 * @param componentTrue Component that will be returned if conditionGetter is "true"
 * @param componentFalse Component that will be returned if conditionGetter is "false"
 * @returns Component Depending on a Condition result
 */
export function componentWithCondition<A extends {}, B extends {}>(
	condition: () => boolean,
	ComponentTrue: ComponentType<A>,
	ComponentFalse: ComponentType<B>,
) {
	const ComponentWithCondition: React.ForwardRefExoticComponent<
		React.PropsWithoutRef<typeof ComponentTrue | typeof ComponentFalse> & React.RefAttributes<any>
	> = forwardRef<ComponentRef<typeof ComponentTrue | typeof ComponentFalse>, any>((props, ref) =>
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore: to unblock React 18.2.0 -> 18.3.1 version bump in Jira
		condition() ? <ComponentTrue {...props} ref={ref} /> : <ComponentFalse {...props} ref={ref} />,
	);
	if (ComponentTrue.name !== '') {
		ComponentWithCondition.displayName = `ComponentWithCondition[${condition.name}]`;
	}

	return ComponentWithCondition as FC<
		PropsWithoutRef<A> & PropsWithoutRef<B> & GetRefAttributes<PropsWithRef<A>, PropsWithRef<B>>
	>;
}
