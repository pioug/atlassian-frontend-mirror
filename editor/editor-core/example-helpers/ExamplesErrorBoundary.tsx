import styled from 'styled-components';
import React from 'react';

const Container: any = styled.div`
  width: 100%;
  border-bottom: 1px solid #333;
`;

const Heading: any = styled.div`
  line-height: 1.7em;
  text-align: center;
  color: black;
  font-size: 1.2em;
  font-weight: bold;
  user-select: none;
  position: sticky;
  top: 0;
  background: #c00;
  border-bottom: 1px solid #333;
`;

const Error: any = styled.div`
  padding: 30px;
  font-family: monospace;
  white-space: pre-wrap;
  background: red;
`;

type ExamplesErrorBoundaryState = {
  error: { error: Error; stack: string } | undefined;
};

export default class ExamplesErrorBoundary extends React.Component<
  any,
  ExamplesErrorBoundaryState
> {
  state: ExamplesErrorBoundaryState = {
    error: undefined,
  };

  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.setState({ error: { error, stack: info.componentStack } });
  }

  render() {
    const { error } = this.state;
    if (error) {
      const { error: errorMessage, stack } = error;
      return (
        <>
          <Container>
            <Heading>💣💥</Heading>
            <Error>{`${errorMessage.toString()}\n${stack}`}</Error>
          </Container>
        </>
      );
    }
    return this.props.children;
  }
}
