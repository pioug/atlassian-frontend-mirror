import React from 'react';
import { Status, Color } from '../src/element';
import styled from 'styled-components';

const Container = styled.div`
  width: 140px;
`;

const StatusInParagraph = ({ text, color }: { text: string; color: Color }) => (
  <p>
    <Status text={text} color={color} />
  </p>
);

export default () => (
  <Container id="container">
    <StatusInParagraph text="Unavailable" color="neutral" />
    <StatusInParagraph text="New" color="purple" />
    <StatusInParagraph text="In progress" color="blue" />
    <StatusInParagraph text="Blocked" color="red" />
    <StatusInParagraph text="On hold" color="yellow" />
    <StatusInParagraph text="Done" color="green" />
  </Container>
);
