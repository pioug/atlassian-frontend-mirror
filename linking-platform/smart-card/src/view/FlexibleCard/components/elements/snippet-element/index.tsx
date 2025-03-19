/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import Text from '../text';
import { type TextProps } from '../text/types';

const SNIPPET_DEFAULT_MAX_LINES = 3;

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const snippetBaseStyleOld = css({
	color: token('color.text', '#172B4D'),
	WebkitUserSelect: 'text',
	MozUserSelect: 'text',
	MsUserSelect: 'text',
	userSelect: 'text',
});

const snippetBaseStyle = css({
	color: token('color.text'),
	minWidth: 0,
	WebkitUserSelect: 'text',
	MozUserSelect: 'text',
	MsUserSelect: 'text',
	userSelect: 'text',
});

const SnippetElement = (props: TextProps) => {
	const {
		content: overrideContent,
		maxLines = SNIPPET_DEFAULT_MAX_LINES,
		className,
		...restOfProps
	} = props ?? {};
	const context = useContext(FlexibleUiContext);

	return (
		<Text
			content={overrideContent ?? context?.snippet}
			maxLines={maxLines}
			css={[
				!fg('platform-linking-visual-refresh-v1') && snippetBaseStyleOld,
				fg('platform-linking-visual-refresh-v1') && snippetBaseStyle,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			{...restOfProps}
		/>
	);
};

export default SnippetElement;
