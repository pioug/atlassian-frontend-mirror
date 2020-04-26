import React from 'react';

import DefaultNPS from '../src';

import { WithDataDisplay } from './helpers/helpers';

export default function Basic() {
  return (
    <WithDataDisplay>
      {({ onFinish }) => <DefaultNPS product="Stride" onFinish={onFinish} />}
    </WithDataDisplay>
  );
}
