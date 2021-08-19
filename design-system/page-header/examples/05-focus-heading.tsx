import React, { useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button from '@atlaskit/button/standard-button';

import PageHeader from '../src';

const breadcrumbs = (
  <Breadcrumbs onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </Breadcrumbs>
);

const PageHeaderFocusHeadingExample = () => {
  const [ref, setRef] = useState<HTMLElement>();

  const onClick = () => {
    if (ref) {
      ref.focus();
    }
  };

  const innerRef = (element: HTMLElement) => {
    setRef(element);
  };

  return (
    <div>
      <Button onClick={onClick}>Focus on heading</Button>
      <PageHeader breadcrumbs={breadcrumbs} innerRef={innerRef}>
        Title describing what content to expect on the page
      </PageHeader>
    </div>
  );
};

export default PageHeaderFocusHeadingExample;
