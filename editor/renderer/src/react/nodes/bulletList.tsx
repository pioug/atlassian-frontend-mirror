import React from 'react';
import { bulletListSelector } from '@atlaskit/adf-schema';

export default function BulletList(props: React.Props<any>) {
  return <ul className={bulletListSelector.substr(1)}>{props.children}</ul>;
}
