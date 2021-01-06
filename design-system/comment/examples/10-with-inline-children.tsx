import React, { ReactNode, useState } from 'react';

import Avatar from '@atlaskit/avatar';

import Comment, { CommentAuthor } from '../src';

import avatarImg from './utils/sample-avatar.png';

interface Props {
  children?: ReactNode;
  shouldRenderNestedCommentsInline?: boolean;
}

const ExampleComment = ({
  children,
  shouldRenderNestedCommentsInline,
}: Props) => (
  <Comment
    avatar={<Avatar src={avatarImg} size="medium" />}
    author={<CommentAuthor href="/author">John Smith</CommentAuthor>}
    content={<p>This comment is so generic it can be repeated</p>}
    shouldRenderNestedCommentsInline={shouldRenderNestedCommentsInline}
  >
    {children}
  </Comment>
);

export default () => {
  const [isRestricted, setIsRestricted] = useState(true);
  return (
    <div>
      <p>
        <label htmlFor="checkbox">
          <input
            id="checkbox"
            type="checkbox"
            onChange={() => setIsRestricted(!isRestricted)}
            checked={isRestricted}
          />{' '}
          Apply <code>shouldRenderNestedCommentsInline</code> to the 2nd and 4th
          comments
        </label>
      </p>
      <p>
        <ExampleComment>
          <ExampleComment shouldRenderNestedCommentsInline={isRestricted}>
            <ExampleComment>
              <ExampleComment shouldRenderNestedCommentsInline={isRestricted}>
                <ExampleComment />
              </ExampleComment>
            </ExampleComment>
          </ExampleComment>
        </ExampleComment>
      </p>
    </div>
  );
};
