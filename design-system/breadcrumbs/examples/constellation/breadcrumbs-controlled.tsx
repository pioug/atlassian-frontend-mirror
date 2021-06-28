import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Breadcrumbs, { BreadcrumbsItem } from '../../src';

const BreadcrumbsControlledExample = () => {
  const [isExpanded, setExpanse] = useState(false);
  return (
    <div>
      <Breadcrumbs
        isExpanded={isExpanded}
        onExpand={() => setExpanse(!isExpanded)}
      >
        <BreadcrumbsItem href="/item" text="Item 1" />
        <BreadcrumbsItem href="/item" text="Item 2" />
        <BreadcrumbsItem href="/item" text="Item 3" />
        <BreadcrumbsItem href="/item" text="Item 4" />
        <BreadcrumbsItem href="/item" text="Item 5" />
        <BreadcrumbsItem href="/item" text="Item 6" />
        <BreadcrumbsItem href="/item" text="Item 7" />
        <BreadcrumbsItem href="/item" text="Item 8" />
        <BreadcrumbsItem href="/item" text="Item 9" />
        <BreadcrumbsItem href="/item" text="Item 10" />
      </Breadcrumbs>
      <Button appearance="primary" onClick={() => setExpanse(!isExpanded)}>
        Toggle
      </Button>
    </div>
  );
};

export default BreadcrumbsControlledExample;
