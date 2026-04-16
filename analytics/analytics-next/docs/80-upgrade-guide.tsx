/* eslint-disable @atlaskit/design-system/use-primitives-text, @atlaskit/design-system/use-heading, @atlaskit/design-system/no-html-anchor -- Legacy analytics-next docs intentionally use plain HTML prose and links instead of ADS docs primitives. */
import React from 'react';

import { CodeBlock } from './DocBlocks';

const beforeCode = `
withAnalyticsContext<ButtonProps>({})(Button);
withAnalyticsEvents<ButtonProps>({})(Button);
`;

const afterCode = `
withAnalyticsContext({})(Button);
withAnalyticsEvents({})(Button);
`;

const propsCode = `
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

interface ButtonProps extends WithAnalyticsEventsProps {
  appearance: string,
}
`;

const optOutCode = `
export default withAnalyticsContext({})(
  withAnalyticsEvents({})
  <
    ButtonProps,
    React.ComponentType<ButtonProps>
  >(Button),
);
`;

export default function UpgradeGuide(): React.JSX.Element {
	return (
		<div>
			<h2>v5 to v6</h2>
			<h3>✨ TypeScript support</h3>
			<p>Analytics-next is now completely written in TypeScript</p>
			<h3>🧠 HOC Type inference</h3>
			<p>
				In v5, the main problem areas for <code>analytics-next</code>, with regards to TypeScript,
				was <code>withAnalyticsEvents</code> and <code>withAnalyticsContext</code>. These two HOCs
				never quite worked as expected, often relying on consumers to cast the return value of the
				function back into the component they wish to export. Recently this was partially mitigated
				by accepting prop types as generics, returning TS type safety with one downside, props must
				be passed into every usage of our HOCs.
			</p>
			<p>
				Now in v6, support for{' '}
				<a href="https://www.typescriptlang.org/docs/handbook/type-inference.html">
					type inference
				</a>{' '}
				is built-in so you no longer have to explicitly pass props as generic types.
			</p>
			<h3>📝 Renaming types and interfaces</h3>
			<p>
				<code>analytics-next</code> previously provided typings via a module declaration file
				(index.d.ts), which was actually slightly misaligned with the source code. Some interfaces
				were used to describe classes, and some classes of the same name were also being exported to
				avoid name clashes. v6 removes those discrepancies by renaming and removing misaligned type
				definitions. See breaking changes for more information.
			</p>
			<h3>💥 Breaking Changes:</h3>
			<ul>
				<li>flow types have been removed</li>
				<li>
					<code>withAnalyticsEvents</code> now infers proptypes automatically, consumers no longer
					need to provide props as a generic type.
				</li>
				<li>
					<code>withAnalyticsContext</code> now infers proptypes automatically, consumers no longer
					need to provide props as a generic type.
				</li>
				<li>
					Type <code>WithAnalyticsEventProps</code> has been renamed to{' '}
					<code>WithAnalyticsEventsProps</code> to match source code
				</li>
				<li>
					Type <code>CreateUIAnalyticsEventSignature</code> has been renamed to{' '}
					<code>CreateUIAnalyticsEvent</code> to match source code
				</li>
				<li>
					Type <code>UIAnalyticsEventHandlerSignature</code> has been renamed to{' '}
					<code>UIAnalyticsEventHandler</code> to match source code
				</li>
				<li>
					Type <code>AnalyticsEventsPayload</code> has been renamed to{' '}
					<code>AnalyticsEventPayload</code>
				</li>
				<li>
					Type <code>ObjectType</code> has been removed, please use{' '}
					<code>Record&lt;string, any&gt;</code> or <code>[key: string]: any</code>
				</li>
				<li>
					Type <code>UIAnalyticsEventInterface</code> has been removed, please use{' '}
					<code>UIAnalyticsEvent</code>
				</li>
				<li>
					Type <code>AnalyticsEventInterface</code> has been removed, please use{' '}
					<code>AnalyticsEvent</code>
				</li>
				<li>
					Type <code>CreateAndFireEventFunction</code> removed and should now be inferred by
					TypeScript
				</li>
				<li>
					Type <code>AnalyticsEventUpdater</code> removed and should now be inferred by TypeScript
				</li>
			</ul>
			<hr role="presentation" />
			<h3>⬆️ Upgrade guide</h3>
			<p>
				<em>Applicable to TypeScript users only</em>
			</p>
			<h4>Renaming types and interfaces</h4>
			<p>
				Most of the breaking changes above can be avoided with a &apos;find-and-replace&apos; of the
				following types/interfaces:
			</p>
			<ul>
				<li>
					<code>WithAnalyticsEventProps</code> =&gt; <code>WithAnalyticsEventsProps</code>
				</li>
				<li>
					<code>CreateUIAnalyticsEventSignature</code> =&gt; <code>CreateUIAnalyticsEvent</code>
				</li>
				<li>
					<code>UIAnalyticsEventHandlerSignature</code> =&gt; <code>UIAnalyticsEventHandler</code>
				</li>
				<li>
					<code>AnalyticsEventsPayload</code> =&gt; <code>AnalyticsEventPayload</code>
				</li>
			</ul>
			<p>
				Some interfaces were used to describe a class instance. This is no longer needed since a
				class in TypeScript can be used as a type. These interfaces should be replaced by their
				class equivalents:
			</p>
			<ul>
				<li>
					<code>UIAnalyticsEventInterface</code> =&gt; <code>UIAnalyticsEvent</code>
				</li>
				<li>
					<code>AnalyticsEventInterface</code> =&gt; <code>AnalyticsEvent</code>
				</li>
			</ul>
			<p>
				The following types have been removed from the library and can either be safely replaced
				with an alternate type or removed entirely in favour of type inference:
			</p>
			<ul>
				<li>
					<code>ObjectType</code> =&gt; <code>Record&lt;string, any&gt;</code> or{' '}
					<code>[key: string]: any</code>
				</li>
				<li>
					<code>CreateAndFireEventFunction</code> now inferred by TypeScript
				</li>
				<li>
					<code>AnalyticsEventUpdater</code> now inferred by TypeScript
				</li>
			</ul>
			<h4>
				Using <code>withAnalyticsEvents</code> and <code>withAnalyticsContext</code> with
				type-safety
			</h4>
			<p>
				After upgrading to v6, you might now be greeted with TypeScript errors relating to{' '}
				<code>withAnalyticsEvents</code> and <code>withAnalyticsContext</code>. As described above,
				there have been a lot of changes to the way types are applied to these HOCs.
			</p>
			<p>
				Previously, props needed to be explicitly defined and passed in as{' '}
				<a href="https://www.typescriptlang.org/docs/handbook/generics.html">
					generic type arguments
				</a>
				. Now, you should be able to remove the generic types and let TypeScript do the heavy
				lifting.
			</p>
			<p>
				<strong>Before…</strong>
			</p>
			<CodeBlock code={beforeCode} />
			<p>
				<strong>After…</strong>
			</p>
			<CodeBlock code={afterCode} />
			<p>
				This does however require you to extend your component&apos;s props with{' '}
				<code>WithAnalyticsEventProps</code>. A common pattern you’ll find with other HOC
				implementations, used to ensure you’re passing the correct super type to the HOC.
			</p>
			<CodeBlock code={propsCode} />
			<p>
				To provide additional flexibility, you can now opt-out of type inference if needed. It might
				be necessary in edge-cases where TypeScript is not able to infer the prop types of the
				component you have supplied. If that&apos;s the case, try passing in the generic type
				arguments to <code>withAnalyticsEvents</code>.
			</p>
			<CodeBlock code={optOutCode} />
		</div>
	);
}
