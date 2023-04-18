import React, { SyntheticEvent, useState } from 'react';

import Text from '@atlaskit/ds-explorations/text';
import Stack from '@atlaskit/primitives/stack';

import Pagination from '../src';

const Pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function BasicExample() {
  const [onChangeEvent, setOnChangeEvent] = useState(1);

  const handleChange = (event: SyntheticEvent, newPage: any) =>
    setOnChangeEvent(newPage);

  return (
    <Stack space="space.150">
      <Pagination testId="pagination" pages={Pages} onChange={handleChange} />
      <Text testId="description" as="p">
        selected page from onChange hook: {onChangeEvent}
      </Text>
    </Stack>
  );
}
