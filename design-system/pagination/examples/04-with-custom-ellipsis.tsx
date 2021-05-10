import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import SectionMessage from '@atlaskit/section-message';

import Pagination from '../src';

export default function CustomEllipisExample() {
  const [maxPageSize, setMaxPageSize] = useState(7);

  const handleEllipsisCLick = () => setMaxPageSize(10);

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <SectionMessage title="Using the example">
          <p>Please click on the ellipsis to expand the Pagination</p>
        </SectionMessage>
      </div>
      <Pagination
        testId="pagination"
        renderEllipsis={({ key }: { key: string }) => (
          <Button
            onClick={() => handleEllipsisCLick()}
            appearance="subtle"
            key={key}
            aria-label="expand"
          >
            ...
          </Button>
        )}
        max={maxPageSize}
        pages={[...Array(10)].map((_, i) => i + 1)}
      />
    </>
  );
}
