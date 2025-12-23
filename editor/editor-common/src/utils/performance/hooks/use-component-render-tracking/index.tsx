import { useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuidv4 from 'uuid/v4';

import {
	getPropsDifference,
	getShallowPropsDifference,
	type PropsDifference,
	type ShallowPropsDifference,
} from '../../../compare-props';

type PropsDiff<Props> = ShallowPropsDifference<Props> | PropsDifference<Props>;

type OnRenderCb<Props = undefined> = ({
	renderCount,
	propsDifference,
}: {
	componentId: string;
	propsDifference: PropsDiff<Props> | undefined;
	renderCount: number;
}) => void;

export type UseComponentRenderTrackingArgs<Props = undefined> = {
	onRender: OnRenderCb<Props>;
	propsDiffingOptions?: {
		enabled: boolean;
		props?: Props;
		propsToIgnore?: Array<keyof Props>;
		useShallow?: boolean;
	};
	zeroBasedCount?: boolean;
};

export function useComponentRenderTracking<Props = undefined>({
	onRender,
	propsDiffingOptions,
	zeroBasedCount = true,
}: UseComponentRenderTrackingArgs<Props>): void {
	const propsRef = useRef<Props>();
	const renderCountRef = useRef<number>(zeroBasedCount ? 0 : 1);
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const { current: componentId } = useRef<string>(uuidv4());

	useEffect(() => {
		const lastProps = propsRef.current;
		const renderCount = renderCountRef.current;

		let propsDifference;
		if (propsDiffingOptions?.enabled && lastProps) {
			propsDifference = propsDiffingOptions?.useShallow
				? getShallowPropsDifference(lastProps, propsDiffingOptions.props)
				: getPropsDifference(
						lastProps,
						propsDiffingOptions.props as Props,
						0,
						2,
						propsDiffingOptions?.propsToIgnore,
					);
		}
		const result = {
			renderCount,
			propsDifference,
			componentId,
		};

		onRender(result);
		if (propsDiffingOptions?.enabled) {
			propsRef.current = propsDiffingOptions.props;
		}
		renderCountRef.current = renderCountRef.current + 1;
	}); // No dependencies run on each render
}
