import React, { SyntheticEvent, useState } from 'react';

import Stack from '@atlaskit/ds-explorations/stack';
import Text from '@atlaskit/ds-explorations/text';

import Pagination from '../src';

const Pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function BasicExample() {
  const [onChangeEvent, setOnChangeEvent] = useState(1);

  const handleChange = (event: SyntheticEvent, newPage: any) =>
    setOnChangeEvent(newPage);

  return (
    <Stack gap="space.150">
      <Pagination testId="pagination" pages={Pages} onChange={handleChange} />
      <Text testId="description" as="p">
        selected page from onChange hook: {onChangeEvent}
      </Text>
    </Stack>
  );
}
