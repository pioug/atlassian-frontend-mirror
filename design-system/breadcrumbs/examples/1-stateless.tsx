import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { AtlassianIcon } from '@atlaskit/logo';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

const StatelessExample = () => {
  const [isExpanded, setExpanse] = useState(false);

  return (
    <div>
      <Breadcrumbs
        isExpanded={isExpanded}
        maxItems={2}
        testId="MyBreadcrumbsTestId"
      >
        <BreadcrumbsItem href="/pages" text="Pages" />
        <BreadcrumbsItem href="/pages/home" text="Home" />
        <BreadcrumbsItem
          href="/item"
          iconBefore={<AtlassianIcon label="Test icon" size="small" />}
          text="Icon Before"
        />
        <BreadcrumbsItem
          href="/item"
          iconAfter={<AtlassianIcon label="Test icon" size="small" />}
          text="Icon After"
        />
      </Breadcrumbs>
      <Button appearance="primary" onClick={() => setExpanse(!isExpanded)}>
        Toggle
      </Button>
    </div>
  );
};

export default StatelessExample;
