/** @jsx jsx */
import { css, jsx, type SerializedStyles } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import React, { useContext } from 'react';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import Text from '../text';
import { type TextProps } from '../text/types';

const SNIPPET_DEFAULT_MAX_LINES = 3;

const getSnippetStyles = (overrideCss?: SerializedStyles) =>
	css(
		{
			color: token('color.text', '#172B4D'),
			WebkitUserSelect: 'text',
			MozUserSelect: 'text',
			MsUserSelect: 'text',
			userSelect: 'text',
		},
		overrideCss,
	);

const SnippetElement: React.FC<TextProps> = ({
	content: overrideContent,
	maxLines = SNIPPET_DEFAULT_MAX_LINES,
	overrideCss,
	...props
} = {}) => {
	const context = useContext(FlexibleUiContext);

	return (
		<Text
			content={overrideContent ?? context?.snippet}
			maxLines={maxLines}
			overrideCss={getSnippetStyles(overrideCss)}
			{...props}
		/>
	);
};

export default SnippetElement;
