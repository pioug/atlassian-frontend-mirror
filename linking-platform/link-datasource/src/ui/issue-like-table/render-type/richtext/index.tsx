/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useMemo } from 'react';

import { css, jsx } from '@compiled/react';
import dompurify from 'dompurify';

import type { RichText } from '@atlaskit/linking-types/datasource';

import { parseRichText } from './parseRichText';

const rootStyles = css({
	position: 'relative',
	cursor: 'default',
});

const RichTextType = ({ value }: { value: RichText }): JSX.Element => {
	const adfPlainText = useMemo(() => parseRichText(value), [value]);

	if (value.html && value.html.trim() !== '') {
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
