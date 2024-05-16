import React from 'react';

import commentRendererAdf from '../__fixtures__/comment-renderer-media-adf.json';
import { wrappedCommentRendererAdf } from '../__fixtures__/comment-renderer-wrapped-media.adf';
import { MediaBaseRenderer } from '../__helpers/mediaRenderer';

export const MediaComment = () => {
  return <MediaBaseRenderer adf={commentRendererAdf} appearance="comment" />;
};

export const MediaCommentWrapped = () => {
  return (
    <MediaBaseRenderer adf={wrappedCommentRendererAdf} appearance="comment" />
  );
};
