import React from 'react';

import { AtlassianIcon } from '@atlaskit/logo';

import Breadcrumbs, { BreadcrumbsItem } from '../../src';

const TestIcon = <AtlassianIcon label="Test icon" size="small" />;

const BreadcrumbsItemIconAfterExample = () => {
  return (
    <Breadcrumbs>
      <BreadcrumbsItem iconAfter={TestIcon} text="Atlassian" />
    </Breadcrumbs>
  );
};

export default BreadcrumbsItemIconAfterExample;
