import React from 'react';
import Avatar from '@atlaskit/avatar';
import Tag from '@atlaskit/tag';
import TagGroup from '../src';

const tagNames = [
  'liquorice',
  'bear-claw',
  'croissant',
  'cotton',
  'candy',
  'caramels',
  'lollipop',
  'jelly',
  'sweet',
  'roll',
  'marzipan',
  'biscuit',
  'oat',
  'cake',
  'icing',
  'cookie',
  'sesame',
  'snaps',
  'gingerbread',
  'gummi',
  'bears',
  'jelly-o',
  'apple',
  'pie',
  'brownie',
  'gummies',
  'pudding',
  'beans',
  'carrot',
  'canes',
  'toffee',
  'cheesecake',
  'sugar',
  'plum',
  'powder',
  'fruitcake',
  'dessert',
  'chocolate',
  'bar',
  'tart',
  'chupa',
  'chups',
  'soufflé',
  'tootsie',
  'danish',
  'marshmallow',
  'wafer',
];

export default () => (
  <TagGroup>
    {tagNames.map(sweet => (
      <Tag
        appearance="rounded"
        elemBefore={<Avatar size="xsmall" />}
        href="http://www.cupcakeipsum.com/"
        key={sweet}
        text={sweet}
        removeButtonText="remove"
      />
    ))}
  </TagGroup>
);
