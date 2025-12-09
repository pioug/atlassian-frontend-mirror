import React from 'react';

import commentRendererAdf from '../__fixtures__/comment-renderer-media-adf.json';
import { wrappedCommentRendererAdf } from '../__fixtures__/comment-renderer-wrapped-media.adf';
import { MediaBaseRenderer } from '../__helpers/mediaRenderer';

export const MediaComment = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={commentRendererAdf} appearance="comment" />;
};

export const MediaCommentWrapped = (): React.JSX.Element => {
	return <MediaBaseRenderer adf={wrappedCommentRendererAdf} appearance="comment" />;
};
