import React, { SyntheticEvent, useState } from 'react';

import { Code } from '@atlaskit/code';
import Stack from '@atlaskit/ds-explorations/stack';
import Text from '@atlaskit/ds-explorations/text';

import Pagination from '../src';

const PAGES = [...Array(10)].map((_, i) => ({
  label: i + 1,
  href: `page-${i + 1}`,
}));

export default function ComplexDataExample() {
  const [onChangeEvent, setOnChangeEvent] = useState({
    label: 1,
    href: 'page-1',
  });

  const handleChange = (event: SyntheticEvent, newPage: any) =>
    setOnChangeEvent(newPage);

  const getLabel = ({ label }: any) => label;

  return (
    <Stack gap="space.150">
      <Pagination
        testId="pagination"
        pages={PAGES}
        onChange={handleChange}
        getPageLabel={getLabel}
      />
      <Text as="p">Received onChange event:</Text>
      <Code>
        {JSON.stringify(
          {
            label: onChangeEvent.label,
            href: onChangeEvent.href,
          },
          null,
          2,
        )}
      </Code>
    </Stack>
  );
}
