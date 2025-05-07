import { useMemo, useRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

export function useMemoFromPropsDerivative<Memo, PropsDerivative, Props>(
	factory: (propsDerivative: PropsDerivative) => Memo,
	propsDerivator: (props: Props) => PropsDerivative,
	props: Props,
) {
	// cache the last set of props
	const prev = useRef<Props>(props);
	const prevFactory = useRef<Memo | null>(null);

	return useMemo(
		() => {
			const init = propsDerivator(props);
			if (fg('cc_complexit_fe_reduce_fragment_serialization')) {
				// check if the serializer is already created
				let shouldCreate: boolean = !prevFactory.current;
				// check each prop to see if value has changed and also check if the number of props has changed
				if (prev.current !== props) {
					// @ts-ignore - error TS2769: No overload matches this call.
					const propsEntries = Object.entries(props);
					// Break these into its own const to skip TS checks.
					// @ts-ignore - error TS2769: No overload matches this call.
					const isLengthDifferent = propsEntries.length !== Object.keys(prev.current).length;
					// @ts-ignore
					const isValueDifferent = propsEntries.some(([key, prop]) => prev.current[key] !== prop);
					shouldCreate = isLengthDifferent || isValueDifferent;
				}

				prev.current = props;
				// If first time or any prop value has changed, create a new serializer
				if (shouldCreate) {
					prevFactory.current = factory(init);
				}
			}

			// If progressive rendering is enabled, create a new serializer
			if (fg('cc_complexit_fe_progressive_adf_rendering')) {
				// @ts-ignore - erorr TS2339 Property 'createSerializer' does not exist on type 'Props'.
				const newSerializer = props.createSerializer?.(init);
				if (newSerializer) {
					return newSerializer;
				}
			}

			return fg('cc_complexit_fe_reduce_fragment_serialization')
				? prevFactory.current
				: factory(init);
		},
		// To keep deps consistent, here disable the exhaustive-deps rule to drop factory from the deps array
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[propsDerivator, props],
	);
}
