const tagMotionCapability = Symbol.for('@atlaskit/tag/motion-capable');

/**
 * Marks public Tag component wrappers that render TagMotion when the motion feature gate is enabled.
 */
export function markAsTagMotionCapable<Component extends object>(component: Component): Component {
	Object.defineProperty(component, tagMotionCapability, { value: true });

	return component;
}
