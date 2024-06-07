/** @jsx jsx */
import { useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import { type DocNode } from '@atlaskit/adf-schema';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { type RichText } from '@atlaskit/linking-types';

const rootStyles = css({
	position: 'relative',
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
