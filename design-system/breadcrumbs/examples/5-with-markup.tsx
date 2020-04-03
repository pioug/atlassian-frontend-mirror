import React from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default () => (
  // with markup in content
  <Breadcrumbs>
    <BreadcrumbsItem href="/page" text="<b>Page</b>" />
    <BreadcrumbsItem href="/page" text="<script>alert();</script>" />
  </Breadcrumbs>
);
