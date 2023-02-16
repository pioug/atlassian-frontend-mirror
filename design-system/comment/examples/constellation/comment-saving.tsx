import React, { useState } from 'react';

import Avatar from '@atlaskit/avatar';
import { Checkbox } from '@atlaskit/checkbox';

import Comment, { CommentAction, CommentAuthor, CommentTime } from '../../src';
import sampleAvatar from '../utils/sample-avatar';

const CommentDefaultExample = () => {
  const [saving, setSaving] = useState(true);

  return (
    <>
      <div>
        <Checkbox
          label="Enable saving mode"
          isChecked={saving}
          onChange={(e) => setSaving(e.currentTarget.checked)}
        />
      </div>
      <Comment
        isSaving={saving}
        savingText="Saving..."
        avatar={<Avatar name="Scott Farquhar" src={sampleAvatar} />}
        author={<CommentAuthor>Scott Farquhar</CommentAuthor>}
        time={<CommentTime>Mar 14, 2022</CommentTime>}
        content={
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        }
        actions={[
          <CommentAction>Reply</CommentAction>,
          <CommentAction>Edit</CommentAction>,
          <CommentAction>Like</CommentAction>,
        ]}
      />
    </>
  );
};

export default CommentDefaultExample;
