import React from 'react';
import Banner from '../src';

const { Fragment } = React;

export default () => (
  <Fragment>
    <Banner isOpen appearance="announcement">
      Simple announcement banner
    </Banner>
  </Fragment>
);
