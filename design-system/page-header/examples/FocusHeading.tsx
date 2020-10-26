import React, { useState } from 'react';

import { BreadcrumbsItem, BreadcrumbsStateless } from '@atlaskit/breadcrumbs';
import Button from '@atlaskit/button/standard-button';

import PageHeader from '../src';

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </BreadcrumbsStateless>
);

const MyPageHeader = () => {
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
        Title describing the content
      </PageHeader>
    </div>
  );
};

export default () => <MyPageHeader />;
