import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import Text from '@atlaskit/ds-explorations/text';
import Stack from '@atlaskit/primitives/stack';
import SectionMessage from '@atlaskit/section-message';

import Pagination from '../src';

export default function CustomEllipsisExample() {
  const [maxPageSize, setMaxPageSize] = useState(7);

  const handleEllipsisCLick = () => setMaxPageSize(10);

  return (
    <Stack space="space.150">
      <SectionMessage title="Using the example">
        <Text as="p">
          Please click on the ellipsis to expand the Pagination
        </Text>
      </SectionMessage>
      <Pagination
        testId="pagination"
        renderEllipsis={({ key }: { key: string }) => (
          <Button
            onClick={() => handleEllipsisCLick()}
            appearance="subtle"
            key={key}
            aria-label="expand"
          >
            &hellip;
          </Button>
        )}
        max={maxPageSize}
        pages={[...Array(10)].map((_, i) => i + 1)}
      />
    </Stack>
  );
}
