import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`

The comment component exports both the wrapper component for comments, as well as several smaller components designed to be passed in to the comment component to display a richer comment.

## Usage

The complete export is:

${code`
import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentLayout,
  CommentTime
} from @atlaskit/comment;
`}

All subcomponents are expected as props with the same lowercased name.

All children components are displayed indented after the comment body, allowing nesting of comments.

${(
  <Example
    packageName="@atlaskit/comment"
    Component={require('../examples/01-example-comment').default}
    title="Basic"
    source={require('!!raw-loader!../examples/01-example-comment')}
  />
)}

${(
  <Example
    packageName="@atlaskit/comment"
    Component={require('../examples/02-comment-components').default}
    title="Comment as Components"
    source={require('!!raw-loader!../examples/02-comment-components')}
  />
)}

${(
  <Example
    packageName="@atlaskit/comment"
    Component={require('../examples/03-nested-comments').default}
    title="Nested Comments"
    source={require('!!raw-loader!../examples/03-nested-comments')}
  />
)}

${(
  <Props
    heading="Comment Props"
    props={require('!!extract-react-types-loader!../src/components/comment')}
  />
)}

${(
  <Props
    heading="CommentAction Props"
    props={require('!!extract-react-types-loader!../src/components/action-item')}
  />
)}

${(
  <Props
    heading="CommentAuthor Props"
    props={require('!!extract-react-types-loader!../src/components/author')}
  />
)}

${(
  <Props
    heading="CommentEdited Props"
    props={require('!!extract-react-types-loader!../src/components/edited')}
  />
)}

${(
  <Props
    heading="CommentLayout Props"
    props={require('!!extract-react-types-loader!../src/components/layout')}
  />
)}

${(
  <Props
    heading="CommentTime Props"
    props={require('!!extract-react-types-loader!../src/components/time')}
  />
)}
`;
