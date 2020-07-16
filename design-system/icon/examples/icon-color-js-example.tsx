import React, { Component } from 'react';
import { B500, B75 } from '@atlaskit/theme/colors';

import HomeCircleIcon from '../glyph/home-circle';

export default class Example extends Component<{}, {}> {
  render() {
    return (
      <div>
        <HomeCircleIcon
          primaryColor="rebeccapurple"
          secondaryColor="yellow"
          size="xlarge"
          label=""
        />
        <HomeCircleIcon
          primaryColor={B500}
          secondaryColor={B75}
          size="xlarge"
          label=""
        />
      </div>
    );
  }
}
