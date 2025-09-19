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
	const ComponentWithCondition = forwardRef<
		ComponentRef<typeof ComponentTrue | typeof ComponentFalse>,
		PropsWithoutRef<A> & PropsWithoutRef<B>
	>((props, ref) =>
		condition() ? (
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			<ComponentTrue {...(props as A)} ref={ref} />
		) : (
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			<ComponentFalse {...(props as B)} ref={ref} />
		),
	);
	if (ComponentTrue.name !== '') {
		ComponentWithCondition.displayName = `ComponentWithCondition[${condition.name}]`;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	return ComponentWithCondition as FC<
		PropsWithoutRef<A> & PropsWithoutRef<B> & GetRefAttributes<PropsWithRef<A>, PropsWithRef<B>>
	>;
}
