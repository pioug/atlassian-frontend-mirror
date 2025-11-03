/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useMemo } from 'react';

import { css, jsx } from '@compiled/react';
import dompurify from 'dompurify';

import { type DocNode } from '@atlaskit/adf-schema';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { type RichText } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

const rootStyles = css({
	position: 'relative',
	cursor: 'default',
});

const smartLinkNodeToUrl: (node: PMNode) => string = (node) => node.attrs.url ?? '';

const schemaSmartLinkOverride = new Schema({
	nodes: defaultSchema.spec.nodes
		.update('inlineCard', {
			...defaultSchema.spec.nodes.get('inlineCard'),
			leafText: smartLinkNodeToUrl,
		})
		.update('blockCard', {
			...defaultSchema.spec.nodes.get('blockCard'),
			leafText: smartLinkNodeToUrl,
		})
		.update('embedCard', {
			...defaultSchema.spec.nodes.get('embedCard'),
			leafText: smartLinkNodeToUrl,
		}),
	marks: defaultSchema.spec.marks,
});

export const parseRichText = (value: RichText): string | null => {
	try {
		if (value.type === 'adf') {
			const adf = JSON.parse(value.text) as DocNode;

			return PMNode.fromJSON(schemaSmartLinkOverride, {
				...adf,
				content: [...adf.content.slice(0, 2)],
			}).textContent;
		}
		return null;
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error('error parsing adf', e);
		return null;
	}
};

const RichTextType = ({ value }: { value: RichText }) => {
	const adfPlainText = useMemo(() => parseRichText(value), [value]);

	if (value.html && value.html.trim() !== '' && fg('platform_navx_jira_sllv_rich_text_gate')) {
		// eslint-disable-next-line react/no-danger
		return (
			<div
				css={rootStyles}
				data-testid="datasource-richtext-html-content"
				dangerouslySetInnerHTML={{ __html: dompurify.sanitize(value.html) }}
			/>
		);
	}

	if (adfPlainText) {
		return (
			<span css={rootStyles} data-testid="richtext-plaintext">
				{adfPlainText}
			</span>
		);
	} else {
		return <span data-testid="richtext-unsupported" />;
	}
};

export default RichTextType;
