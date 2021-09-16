/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { TagColor } from '../src';
import Tag from '../src/tag/simple-tag';

const tagColors = { blue: 'blue' as TagColor };

export default () => (
  <div id="simpleTags">
    <Tag text="standard Tag" color="standard" />
    <Tag text="blue Tag" color={tagColors.blue} />
    <Tag text="green Tag" color="green" />
    <Tag text="teal Tag" color="teal" />
    <Tag text="purple Tag" color="purple" />
    <Tag text="red Tag" color="red" />
    <Tag text="yellow Tag" color="yellow" />
    <Tag text="grey Tag" color="grey" />
    <Tag text="greenLight Tag" color="greenLight" />
    <Tag text="tealLight Tag" color="tealLight" />
    <Tag text="blueLight Tag" color="blueLight" />
    <Tag text="purpleLight Tag" color="purpleLight" />
    <Tag text="redLight Tag" color="redLight" />
    <Tag text="yellowLight Tag" color="yellowLight" />
    <Tag text="greyLight Tag" color="greyLight" />
  </div>
);
