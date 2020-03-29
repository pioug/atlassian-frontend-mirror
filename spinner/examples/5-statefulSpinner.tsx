import React, { PureComponent } from 'react';
import Spinner from '../src';

interface Props {}

type State = {
  active: boolean;
  delay: number;
  state: 'spinning' | 'removing' | 'completed';
};

class StatefulSpinner extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      active: true,
      delay: 100,
      state: 'spinning',
    };
  }

  handleSpinnerClick = () => {
    this.setState({
      active: !this.state.active,
      state: this.state.active ? 'removing' : 'spinning',
    });
  };

  handleOnComplete = () => {
    this.setState({ state: 'completed' });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ delay: Number.parseInt(e.target.value, 10) });
  };

  /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
  render() {
    const containerStyles = {
      display: 'inline-flex',
      padding: '10px',
      border: '1px solid',
    };
    const inputStyles = {
      marginLeft: '5px',
      width: '5em',
    };
    const labelStyles = {
      marginLeft: '10px',
    };
    return (
      <div>
        <div style={containerStyles} onClick={this.handleSpinnerClick}>
          <Spinner
            delay={this.state.delay}
            isCompleting={!this.state.active}
            onComplete={this.handleOnComplete}
          />
          <label htmlFor="delayInput" style={labelStyles}>
            Delay
          </label>
          <input
            type="number"
            id="delayInput"
            style={inputStyles}
            value={this.state.delay}
            onChange={this.handleInputChange}
          />
        </div>
        <div>Click the spinner to see it&#39;s fade in and out animations.</div>
        <div>
          The delay field will modify the delay before the spinner shows.
        </div>
        <div>
          <code>isCompleting</code> is currently set to{' '}
          <code>{`${String(!this.state.active)}`}</code>
        </div>
        <div>
          <code>state</code> is currently set to{' '}
          <code>{`${this.state.state}`}</code>
        </div>
      </div>
    );
  }
  /* eslint-enable jsx-a11y/no-static-element-interactions */
}

export default () => (
  <div style={{ padding: '10px' }}>
    <StatefulSpinner />
  </div>
);
