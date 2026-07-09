/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, cx, jsx } from '@atlaskit/css';
import StaggeredEntrance from '@atlaskit/motion/staggered-entrance';
import { useMotion } from '@atlaskit/motion/use-motion';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	init: {
		visibility: 'hidden',
	},
	entering: {
		animationName: `${token('motion.keyframe.scale.in.medium')}, ${token('motion.keyframe.fade.in')}`,
		animationDuration: token('motion.duration.xlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationFillMode: 'backwards',
	},
});

const items = ['Item A', 'Item B', 'Item C'];

/**
 * Each item is its own component so `useMotion` can read its stagger delay from the
 * surrounding `StaggeredEntrance`. The hook exposes the current motion `state`, which the
 * consumer maps to its own styling — no extra wrapper element is created.
 */
function AnimatedItem({ label }: { label: string }): JSX.Element {
	const { state, ref } = useMotion<HTMLDivElement>();

	return (
		<div
			ref={ref}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(state === 'init' && styles.init, state === 'entering' && styles.entering)}
		>
			{label}
		</div>
	);
}

export default function UseMotionStaggeredExample(): JSX.Element {
	return (
		<StaggeredEntrance columns={1}>
			{items.map((item) => (
				<AnimatedItem key={item} label={item} />
			))}
		</StaggeredEntrance>
	);
}
