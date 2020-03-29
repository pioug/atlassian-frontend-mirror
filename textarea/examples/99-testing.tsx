import React from 'react';
import styled from 'styled-components';
import TextArea from '../src';

const Div = styled.div`
  max-width: 500px;
`;

export default class extends React.Component {
  render() {
    return (
      <Div>
        <p>Basic:</p>
        <TextArea value="I have a data-testid" testId="MyTextAreaTestId" />
      </Div>
    );
  }
}
