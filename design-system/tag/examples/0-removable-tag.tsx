import React from 'react';

import Tag from '../src/tag/removable-tag';

export default () => (
  <div>
    <Tag
      text="Removable button"
      removeButtonLabel="Remove"
      testId="removableTag"
    />
    <Tag
      text="Removal halted"
      removeButtonLabel="Remove"
      onBeforeRemoveAction={() => {
        console.log('Removal halted'); // eslint-disable-line no-console
        return false;
      }}
    />
    <Tag
      text="Post Removal Hook"
      removeButtonLabel="Remove"
      onBeforeRemoveAction={() => {
        console.log('Before removal'); // eslint-disable-line no-console
        return true;
      }}
      onAfterRemoveAction={(e) => console.log('After removal', e)} // eslint-disable-line no-console
    />
    <Tag
      text="Removable Tag"
      color="purpleLight"
      testId="removableTagColor"
      removeButtonLabel="Remove"
    />
  </div>
);
