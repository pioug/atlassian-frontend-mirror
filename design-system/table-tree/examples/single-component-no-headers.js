/* eslint-disable react/prop-types */
import React from 'react';

import TableTree from '../src';

import staticData from './data-structured-nodes.json';

const Title = (props) => <span>{props.title}</span>;
const Numbering = (props) => <span>{props.numbering}</span>;

export default () => (
  <TableTree columns={[Title, Numbering]} items={staticData.children} />
);
