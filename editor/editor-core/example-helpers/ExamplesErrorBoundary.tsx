/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React, { Fragment } from 'react';

const container: any = css`
  width: 100%;
  border-bottom: 1px solid #333;
`;

const heading: any = css`
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

const errorStyle: any = css`
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
        <Fragment>
          <div css={container}>
            <div css={heading}>💣💥</div>
            <div css={errorStyle}>{`${errorMessage.toString()}\n${stack}`}</div>
          </div>
        </Fragment>
      );
    }
    return this.props.children;
  }
}
