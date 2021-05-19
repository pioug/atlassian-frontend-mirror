import React from 'react';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import { BODY_FORMAT_TYPES } from '../model/HelpArticle';
import type { HelpArticle as HelpArticleType } from '../model/HelpArticle';

import {
  ArticleContentInner,
  ArticleContentTitle,
  ArticleContentTitleLink,
} from './styled';
import ArticleBody from './ArticleBody';

const HelpArticle = (props: HelpArticleType) => {
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
              <h2>
                {title}
                <span> </span>
                <ShortcutIcon label="link icon" size="small" />
              </h2>
            </ArticleContentTitleLink>
          ) : (
            <h2>{title}</h2>
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
