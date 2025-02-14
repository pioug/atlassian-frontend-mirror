/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { type Direction, SlideIn } from '@atlaskit/motion';

interface ChildrenAsFunctionProps {
	'data-enter-from': string;
	'data-exit-to': string;
	'data-testid'?: string;
	className?: string;
	ref: Ref<any>;
}

interface NestingMotionProps {
	enterFrom: Direction;
	exitTo: Direction;
	children: (props: ChildrenAsFunctionProps) => React.ReactNode;
	testId?: string;
}

/**
 * @internal
 */
export const NestingMotion = (props: NestingMotionProps) => {
	const { children, enterFrom, exitTo, testId } = props;
	return (
		<SlideIn exitTo={exitTo} enterFrom={enterFrom} animationTimingFunction="ease-out">
			{(innerProps, direction) =>
				children({
					'data-enter-from': enterFrom,
					'data-exit-to': exitTo,
					'data-testid': testId && `${testId}-${direction}`,
					...innerProps,
				})
			}
		</SlideIn>
	);
};
