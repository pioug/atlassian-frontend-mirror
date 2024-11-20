/* eslint-disable react/prop-types */
import React from 'react';

import TableTree from '@atlaskit/table-tree';

import staticData from './data-structured-nodes.json';

const Title = (props: any) => <span>{props.title}</span>;
const Numbering = (props: any) => <span>{props.numbering}</span>;

export default () => <TableTree columns={[Title, Numbering]} items={staticData.children} />;
