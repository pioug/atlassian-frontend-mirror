/** @jsx jsx */
import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ArticleContentInner = styled.div({
	paddingBottom: token('space.200', '16px'),
	position: 'relative',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ArticleContentTitle = styled.div({
	paddingBottom: token('space.200', '16px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ArticleContentTitleLink = styled.a({
	'&:hover': {
		textDecoration: 'none',
	},
});
