/** @jsx jsx */
import { Fragment } from 'react';
import { jsx } from '@emotion/core';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import { PopupSelect, OptionsType } from '../../src';

const options: OptionsType = [
  { label: 'Adelaide', value: 'adelaide' },
  { label: 'Brisbane', value: 'brisbane' },
  { label: 'Canberra', value: 'canberra' },
  { label: 'Darwin', value: 'darwin' },
  { label: 'Hobart', value: 'hobart' },
  { label: 'Melbourne', value: 'melbourne' },
  { label: 'Perth', value: 'perth' },
  { label: 'Sydney', value: 'sydney' },
];

const onChange = console.log;
const defaults = {
  options,
  placeholder: 'Choose a City',
  onChange,
};

const PopupSelectExample = () => (
  <Fragment>
    <div css={{ display: 'flex', justifyContent: 'space-between' }}>
      <PopupSelect
        {...defaults}
        value={options[2]}
        target={({ isOpen, ...triggerProps }) => (
          <button {...triggerProps}>Target</button>
        )}
      />
      <PopupSelect
        {...defaults}
        target={({ isOpen, ...triggerProps }) => (
          <button {...triggerProps}>W/O Search</button>
        )}
        popperProps={{ placement: 'bottom', strategy: 'fixed' }}
        searchThreshold={10}
      />
      <PopupSelect
        {...defaults}
        target={({ isOpen, ...triggerProps }) => (
          <button {...triggerProps}>
            Placement: &ldquo;right-start&rdquo; (flip)
          </button>
        )}
        popperProps={{ placement: 'right-start' }}
      />
    </div>
    <div css={{ display: 'flex' }}>
      <div
        css={{
          background: 'AliceBlue',
          marginBottom: '1em',
          marginTop: '1em',
          padding: '1em',
          height: 500,
          width: 300,
          overflowY: 'auto',
        }}
      >
        <h3>Scroll Container</h3>
        <div css={{ height: 100 }} />
        <PopupSelect
          {...defaults}
          target={({ isOpen, ...triggerProps }) => (
            <button {...triggerProps}>Target</button>
          )}
        />
      </div>
      <div css={{ margin: '1em' }}>
        <PopupSelect
          {...defaults}
          target={({ isOpen, ...triggerProps }) => (
            <button {...triggerProps}>
              <AppSwitcherIcon label="switcher" />
            </button>
          )}
        />
      </div>
    </div>
  </Fragment>
);

export default PopupSelectExample;
