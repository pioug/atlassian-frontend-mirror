import { useMemo, useRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

export function useMemoFromPropsDerivative<
	Memo,
	PropsDerivative,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Props extends Record<string, any>,
>(
	factory: (propsDerivative: PropsDerivative) => Memo,
	propsDerivator: (props: Props) => PropsDerivative,
	props: Props,
) {
	// cache the last set of props
	const prev = useRef<Props>(props);
	const prevFactory = useRef<Memo | null>(null);

	return useMemo(
		() => {
			if (fg('cc_complexit_fe_reduce_fragment_serialization')) {
				// check if the serializer is already created
				let shouldCreate: boolean = !prevFactory.current;
				// check each prop to see if value has changed and also check if the number of props has changed
				if (prev.current !== props) {
					const propsEntries = Object.entries(props);
					shouldCreate =
						propsEntries.length !== Object.keys(prev.current).length ||
						propsEntries.some(([key, prop]) => prev.current[key] !== prop);
				}

				prev.current = props;
				// If first time or any prop value has changed, create a new serializer
				if (shouldCreate) {
					prevFactory.current = factory(propsDerivator(props));
				}
				return prevFactory.current;
			}
			return factory(propsDerivator(props));
		},
		// To keep deps consistent, here disable the exhaustive-deps rule to drop factory from the deps array
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[propsDerivator, props],
	);
}
