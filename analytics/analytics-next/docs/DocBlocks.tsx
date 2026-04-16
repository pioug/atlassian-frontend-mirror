/* eslint-disable @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/design-system/use-heading, @atlaskit/design-system/use-tokens-typography -- Legacy analytics-next docs intentionally use lightweight local HTML doc blocks instead of ADS docs helpers. */
import React from 'react';

type ExampleBlockProps = {
	Component: React.ComponentType;
	source?: string;
	title?: string;
};

type PropsBlockProps = {
	heading?: string;
	props: unknown;
};

const codeBlockStyles: React.CSSProperties = {
	backgroundColor: '#f4f5f7',
	borderRadius: 3,
	overflowX: 'auto',
	padding: 16,
	whiteSpace: 'pre-wrap',
};

const cardStyles: React.CSSProperties = {
	border: '1px solid #dfe1e6',
	borderRadius: 3,
	marginBlock: 16,
	padding: 16,
};

const summaryStyles: React.CSSProperties = {
	cursor: 'pointer',
	fontWeight: 600,
	marginBottom: 12,
};

export function CodeBlock({ code }: { code: string }): React.JSX.Element {
	return (
		<pre style={codeBlockStyles}>
			<code>{code}</code>
		</pre>
	);
}

export function ExampleBlock({ Component, title, source }: ExampleBlockProps): React.JSX.Element {
	return (
		<section style={cardStyles}>
			{title ? <h4>{title}</h4> : null}
			<div style={{ marginBlock: 16 }}>
				<Component />
			</div>
			{source ? (
				<details>
					<summary style={summaryStyles}>View source</summary>
					<CodeBlock code={source} />
				</details>
			) : null}
		</section>
	);
}

const serializeValue = (value: unknown): string => {
	const seen = new WeakSet<object>();

	try {
		return (
			JSON.stringify(
				value,
				(_key, currentValue) => {
					if (typeof currentValue === 'function') {
						return `[Function ${currentValue.name || 'anonymous'}]`;
					}

					if (typeof currentValue === 'symbol') {
						return currentValue.toString();
					}

					if (typeof currentValue === 'undefined') {
						return '[undefined]';
					}

					if (currentValue && typeof currentValue === 'object') {
						if (seen.has(currentValue)) {
							return '[Circular]';
						}

						seen.add(currentValue);
					}

					return currentValue;
				},
				2,
			) ?? ''
		);
	} catch {
		return String(value);
	}
};

export function PropsBlock({ heading = 'Props', props }: PropsBlockProps): React.JSX.Element {
	return (
		<section style={cardStyles}>
			<h4>{heading}</h4>
			<CodeBlock code={serializeValue(props)} />
		</section>
	);
}
