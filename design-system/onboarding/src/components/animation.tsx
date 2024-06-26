import React, { type ReactNode } from 'react';

import { Transition } from 'react-transition-group';

const duration = {
	enter: 0,
	exit: 100,
};

interface Animation {
	[key: string]: { opacity: number };
}

interface FadeProps {
	hasEntered: boolean;
	children: (animationStyles: Record<string, any>) => ReactNode;
	onExited?: () => any;
}

/**
 * __Fade__
 *
 * A fade in animation used for spotlights.
 *
 * @internal
 */
export const Fade = ({ hasEntered, children, onExited }: FadeProps) => (
	<Transition in={hasEntered} timeout={duration} onExited={onExited} unmountOnExit appear>
		{(status: string) => {
			const base = {
				transition: `opacity ${duration.exit}ms`,
				opacity: 0,
			};
			const anim: Animation = {
				entered: { opacity: 1 },
				exiting: { opacity: 0 },
			};

			const style = { ...base, ...anim[status] };

			return children(style);
		}}
	</Transition>
);
