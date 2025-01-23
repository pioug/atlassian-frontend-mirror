/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		overrideCss,
	);

const SnippetElementOld = ({
	content: overrideContent,
	maxLines = SNIPPET_DEFAULT_MAX_LINES,
	overrideCss,
	...props
}: TextProps = {}) => {
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

export default SnippetElementOld;
