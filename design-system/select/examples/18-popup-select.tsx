import React, { Fragment } from 'react';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import Button from '@atlaskit/button';
import { PopupSelect, OptionsType } from '../src';

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
          <Button isSelected={isOpen} {...triggerProps}>
            Target
          </Button>
        )}
      />
      <PopupSelect
        {...defaults}
        target={({ isOpen, ...triggerProps }) => (
          <Button isSelected={isOpen} {...triggerProps}>
            Target
          </Button>
        )}
        popperProps={{ placement: 'bottom', strategy: 'fixed' }}
        searchThreshold={10}
      />
      <PopupSelect
        {...defaults}
        target={({ isOpen, ...triggerProps }) => (
          <Button isSelected={isOpen} {...triggerProps}>
            Placement: &ldquo;right-start&rdquo; (flip)
          </Button>
        )}
        popperProps={{ placement: 'right-start' }}
      />
    </div>
    <div css={{ display: 'flex' }}>
      <div
        style={{
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
        <div style={{ height: 100 }} />
        <PopupSelect
          {...defaults}
          target={({ isOpen, ...triggerProps }) => (
            <Button isSelected={isOpen} {...triggerProps}>
              Target
            </Button>
          )}
        />
        <div style={{ height: 1000 }} />
      </div>
      <div style={{ margin: '1em' }}>
        <PopupSelect
          {...defaults}
          target={({ isOpen, ...triggerProps }) => (
            <Button
              iconBefore={<AppSwitcherIcon label="switcher" />}
              isSelected={isOpen}
              {...triggerProps}
            />
          )}
        />
      </div>
    </div>
    <div style={{ height: 1000 }} />
  </Fragment>
);

export default PopupSelectExample;
