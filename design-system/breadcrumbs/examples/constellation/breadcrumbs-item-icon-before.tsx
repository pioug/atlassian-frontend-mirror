import React from 'react';

import { AtlassianIcon } from '@atlaskit/logo';

import Breadcrumbs, { BreadcrumbsItem } from '../../src';

const TestIcon = <AtlassianIcon label="Test icon" size="small" />;

const BreadcrumbsItemIconBeforeExample = () => {
  return (
    <Breadcrumbs>
      <BreadcrumbsItem iconBefore={TestIcon} text="Atlassian" />
    </Breadcrumbs>
  );
};

export default BreadcrumbsItemIconBeforeExample;
