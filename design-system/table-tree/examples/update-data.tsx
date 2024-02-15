/* eslint-disable react/prop-types */
import React, { Fragment, useState } from 'react';

import Button from '@atlaskit/button/new';
import VisuallyHidden from '@atlaskit/visually-hidden';

import TableTree from '../src';

import staticData from './data-structured-nodes.json';

const Title = (props: any) => <span>{props.title}</span>;
const Numbering = (props: any) => <span>{props.numbering}</span>;

const Example = () => {
  const [data, setData] = useState<any[]>(staticData.children);
  const [liveMessage, setLiveMessage] = useState<string>('');

  const updateData = () => {
    const nextId = data.length + 1;
    const title = `New Entry: ${nextId}`;
    const newItem = {
      id: nextId,
      content: {
        title,
        numbering: nextId,
      },
      hasChildren: false,
    };
    setData((oldData: any[]) => [...oldData, newItem]);
    // Would use double quotes, but VoiceOver says "inches" after the double quotes
    setLiveMessage(`Added new row with title '${title}'.`);
  };

  return (
    <Fragment>
      <Button onClick={updateData}>Add new Item</Button>
      <VisuallyHidden>
        <p aria-live="polite">{liveMessage}</p>
      </VisuallyHidden>
      <TableTree
        headers={['Title', 'Numbering']}
        columns={[Title, Numbering]}
        columnWidths={['200px', '200px']}
        items={data}
      />
    </Fragment>
  );
};

export default Example;
