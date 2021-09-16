import React, { useState } from 'react';

import Tag from '@atlaskit/tag';

import TagGroup from '../src';

interface Props {
  alignment: 'start' | 'end';
}

export function MyTagGroup({ alignment }: Props) {
  const [tags, setTags] = useState([
    'Candy canes',
    'Tiramisu',
    'Gummi bears',
    'Wagon Wheels',
  ]);

  const handleRemoveRequest = () => true;

  const handleRemoveComplete = (text: string) => {
    setTags(tags.filter((str) => str !== text));
    console.log(`Removed ${text}.`);
  };

  return (
    <TagGroup alignment={alignment}>
      {tags.map((text) => (
        <Tag
          key={text}
          onAfterRemoveAction={handleRemoveComplete}
          onBeforeRemoveAction={handleRemoveRequest}
          removeButtonLabel="Remove me"
          text={text}
        />
      ))}
    </TagGroup>
  );
}

export default () => (
  <div>
    <MyTagGroup alignment="start" />
    <MyTagGroup alignment="end" />
  </div>
);
