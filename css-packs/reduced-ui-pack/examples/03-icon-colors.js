import React, { Component, Fragment } from 'react';
// eslint-disable-next-line
import icons from '!!raw-loader!../src/icons-sprite.svg';
// eslint-disable-next-line
import stuff from '!!style-loader!css-loader!../src/bundle.css';
import Warning from './utils/warning';

// eslint-disable-next-line react/no-danger
const Spritemap = () => <div dangerouslySetInnerHTML={{ __html: icons }} />;

class FilledIconExample extends Component {
  state = {
    color: '#253858',
    fill: '#36B37E',
  };

  ColorInput;

  FillInput;

  render() {
    const iconStyles = {
      color: this.state.color,
      fill: this.state.fill,
    };

    return (
      <Fragment>
        <Warning />
        <form>
          <div className="ak-field-group">
            <label htmlFor="color">Icon primary colour</label>
            <input
              type="color"
              className="ak-field-color"
              id="color"
              ref={(input) => {
                this.ColorInput = input;
              }}
              defaultValue={this.state.color}
              onChange={() =>
                this.setState({
                  color: this.ColorInput && this.ColorInput.value,
                })
              }
              name="color"
            />
          </div>
          <div className="ak-field-group">
            <label htmlFor="fill">Icon secondary colour</label>
            <input
              type="color"
              className="ak-field-color"
              id="fill"
              ref={(input) => {
                this.FillInput = input;
              }}
              defaultValue={this.state.fill}
              onChange={() =>
                this.setState({ fill: this.FillInput && this.FillInput.value })
              }
              name="fill"
            />
          </div>
          <p>
            <svg
              focusable="false"
              className="ak-icon ak-icon__size-xlarge"
              style={iconStyles}
              aria-label="Text colour"
            >
              <use xlinkHref="#ak-icon-app-access" />
            </svg>
          </p>
        </form>
      </Fragment>
    );
  }
}

export default () => (
  <div>
    <Spritemap />
    <FilledIconExample />
  </div>
);
