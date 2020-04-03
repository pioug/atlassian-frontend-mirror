import React from 'react';
import { Component } from 'react';
import { ProgressWrapper } from './styled';

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
      <ProgressWrapper>
        <div className={'progressBar'} style={progressBarStyle} />
      </ProgressWrapper>
    );
  }
}
