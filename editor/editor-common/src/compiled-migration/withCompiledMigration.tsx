/**
 * @jsxRuntime classic
 * @jsx jsx
 *
 * IMPORTANT: This file MUST keep the emotion JSX pragma (@jsx jsx from @emotion/react).
 * This is intentional — it allows the HOC to apply emotion styles via the css prop
 * at the call site (where emotion's JSX runtime intercepts it), without requiring
 * the wrapped component to use the emotion pragma itself.
 *
 * This file is part of the Emotion → Compiled CSS-in-JS migration infrastructure.
 * It is temporary and should be removed once the migration is complete.
 *
 * @see https://hello.atlassian.net/wiki/spaces/~712020e6f24689f2da470b80ba6873df7b44a2/pages/6788274038/Emotion+-+Compiled+Feature+Gating+Strategy
 */
import type { ComponentType } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- intentional: this file must use emotion's JSX pragma to apply emotion styles via the css prop
import { jsx, type SerializedStyles } from '@emotion/react';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/**
 * A HOC that enables per-component feature-gated migration from Emotion to Compiled CSS-in-JS.
 *
 * When the `platform_editor_static_css` experiment is ON:
 *   - Renders the component directly. Compiled's statically-extracted CSS classes are applied
 *     via the component's own `css` prop (using the Compiled pragma in the component file).
 *   - No Emotion code runs at all.
 *
 * When the experiment is OFF:
 *   - Renders the component with `css={emotionStyles}`. Because THIS file has the Emotion pragma,
 *     Emotion's JSX runtime intercepts the css prop here, converts it to a className string,
 *     and passes it to the component as `className`. No wrapper div, no ClassNames render prop.
 *
 * @example
 * ```tsx
 * // button.tsx — the base component is style-agnostic, it just accepts className.
 * export function Button({ className }: { className?: string }) {
 *   return <button className={className}>Click me</button>;
 * }
 *
 * // app.tsx — the call site handles both compiled and emotion styles.
 * import { css } from '@compiled/react';
 * import { css as emotionCss } from '@emotion/react';
 * import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
 * import { withCompiledMigration } from '@atlaskit/editor-common/compiled-migration';
 * import { Button } from './button';
 *
 * const compiledStyles = css({ border: '1px solid red' });
 * const emotionStyles = emotionCss({ border: '1px solid red' });
 *
 * // Wrap the component — the HOC applies emotion styles when the experiment is off.
 * const StyledButton = withCompiledMigration(Button, emotionStyles);
 *
 * // At the call site, apply compiled styles conditionally:
 * export function App() {
 *   return (
 *     <StyledButton
 *       css={[expValEquals('platform_editor_static_css', 'isEnabled', true) && compiledStyles]}
 *     />
 *   );
 * }
 * ```
 */
export function withCompiledMigration<P extends { className?: string }>(
	WrappedComponent: ComponentType<P>,
	emotionStyles: SerializedStyles,
) {
	// The cast is required because emotion's `css` prop is injected by the JSX pragma
	// and is not part of the component's declared props type. We widen to P & { css? }
	// so TypeScript accepts the css prop in the emotion branch while preserving P.
	const Comp = WrappedComponent as ComponentType<P & { css?: SerializedStyles }>;

	function MigrationGatedComponent(props: P) {
		const compiledEnabled = expValEquals('platform_editor_static_css', 'isEnabled', true);

		if (compiledEnabled) {
			// Experiment ON — render directly. Compiled's statically-extracted CSS classes
			// are applied inside the component via its own css prop. No Emotion code runs.
			// eslint-disable-next-line react/jsx-props-no-spreading -- HOC must forward all props
			return <Comp {...props} />;
		}

		// Experiment OFF — render with Emotion css prop. Because this file has
		// the emotion JSX pragma, Emotion's JSX runtime intercepts the css prop
		// here, converts it to a className, and passes it through to the component.
		// No wrapper div needed.
		// eslint-disable-next-line react/jsx-props-no-spreading, @atlaskit/ui-styling-standard/use-compiled -- HOC must forward all props; intentional emotion usage for migration
		return <Comp {...props} css={emotionStyles} />;
	}

	const name = WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component';
	MigrationGatedComponent.displayName = `withCompiledMigration(${name})`;
	return MigrationGatedComponent;
}
