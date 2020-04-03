import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Tag from '../src';

const cupcakeipsum =
  'Croissant topping tiramisu gummi bears. Bonbon chocolate bar danish soufflé';

const TableHeading = styled.th`
  font-weight: bold;
`;

interface RowProps {
  name: string;
  children: ReactNode;
}

function Row(props: RowProps) {
  return (
    <tr>
      <TableHeading>{props.name}</TableHeading>
      <td>{props.children}</td>
    </tr>
  );
}

export default function Table() {
  return (
    <table>
      <tbody>
        <Row name="Full text">{cupcakeipsum}</Row>
        <Row name="Text">
          <Tag text={cupcakeipsum} />
        </Row>
        <Row name="Linked">
          <Tag text={cupcakeipsum} href="http://www.cupcakeipsum.com/" />
        </Row>
        <Row name="Removable">
          <Tag text={cupcakeipsum} removeButtonText="No sweets for you!" />
        </Row>
        <Row name="Removable & linked">
          <Tag
            text={cupcakeipsum}
            removeButtonText="No sweets for you!"
            href="http://www.cupcakeipsum.com/"
          />
        </Row>
      </tbody>
    </table>
  );
}
