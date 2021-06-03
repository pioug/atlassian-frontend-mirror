/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';

import { Theme } from '../theme';
import { DefaultProgressBarProps, ThemeTokens } from '../types';

const maxValue = 1;

const Bar = ({
  isIndeterminate,
  tokens,
}: {
  isIndeterminate: boolean;
  tokens: ThemeTokens;
}) => {
  if (isIndeterminate) {
    return (
      <React.Fragment>
        <span css={[tokens.bar, tokens.increasingBar]} />
        <span css={[tokens.bar, tokens.decreasingBar]} />
      </React.Fragment>
    );
  }
  return <span css={[tokens.bar, tokens.determinateBar]} />;
};

export default class ProgressBar extends React.PureComponent<
  DefaultProgressBarProps
> {
  static defaultProps = {
    value: 0,
    isIndeterminate: false,
  };

  render() {
    const { value, isIndeterminate, theme } = this.props;
    const valueParsed = isIndeterminate
      ? 0
      : Math.max(0, Math.min(value, maxValue));

    return (
      <Theme.Provider value={theme}>
        <Theme.Consumer value={value}>
          {(tokens) => (
            <div
              css={tokens.container}
              role="progressbar"
              aria-valuemin={0}
              aria-valuenow={valueParsed}
              aria-valuemax={maxValue}
              tabIndex={0}
            >
              <Bar isIndeterminate={isIndeterminate} tokens={tokens} />
            </div>
          )}
        </Theme.Consumer>
      </Theme.Provider>
    );
  }
}
