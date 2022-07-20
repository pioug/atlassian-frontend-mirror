/**@jsx jsx */
import { jsx } from '@emotion/react';
import { Component } from 'react';
import { progressWrapperStyles } from './styles';

export interface ProgressBarProps {
  progress?: number;
}

export class ProgressBar extends Component<ProgressBarProps, {}> {
  render() {
    if (typeof this.props.progress !== 'number') {
      return null;
    }

    const progress = Math.min(1, Math.max(0, this.props.progress));
    const progressBarStyle = { width: `${progress * 100}%` };
    return (
      <div css={progressWrapperStyles}>
        <div className={'progressBar'} style={progressBarStyle} />
      </div>
    );
  }
}
