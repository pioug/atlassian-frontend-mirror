import React from 'react';

import Heading from '@atlaskit/heading/heading';
import ShortcutIcon from '@atlaskit/icon/core/link-external';
import { Text } from '@atlaskit/primitives/compiled';

import { BODY_FORMAT_TYPES } from '../model/HelpArticle';
import type { HelpArticle as HelpArticleType } from '../model/HelpArticle';
import ArticleBody from './ArticleBody';
import { ArticleContentInner, ArticleContentTitle, ArticleContentTitleLink } from './styled';

const HelpArticle = (props: HelpArticleType): React.JSX.Element => {
	const {
		title = '',
		body,
		bodyFormat = BODY_FORMAT_TYPES.html,
		titleLinkUrl,
		onArticleRenderBegin,
		onArticleRenderDone,
	} = props;

	return (
		<ArticleContentInner>
			{title && (
				<ArticleContentTitle>
					{titleLinkUrl ? (
						<ArticleContentTitleLink href={titleLinkUrl} target="_blank">
							<Heading size="large">
								{title}
								<Text> </Text>
								<ShortcutIcon color="currentColor" label="link icon" />
							</Heading>
						</ArticleContentTitleLink>
					) : (
						<Heading size="large">{title}</Heading>
					)}
				</ArticleContentTitle>
			)}
			<ArticleBody
				body={body}
				bodyFormat={bodyFormat}
				onArticleRenderBegin={onArticleRenderBegin}
				onArticleRenderDone={onArticleRenderDone}
			/>
		</ArticleContentInner>
	);
};

export default HelpArticle;
