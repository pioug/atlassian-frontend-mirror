/** @jsx jsx */
import { Fragment } from 'react';

import { jsx } from '@emotion/core';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import { token } from '@atlaskit/tokens';
import Button from '@atlaskit/button';

import { PopupSelect } from '../../src';

const options = [
  {
    label: 'States',
    options: [
      { label: 'Adelaide', value: 'adelaide' },
      { label: 'Brisbane', value: 'brisbane' },
      { label: 'Melbourne', value: 'melbourne' },
      { label: 'Perth', value: 'perth' },
      { label: 'Sydney', value: 'sydney' },
      { label: 'Hobart', value: 'hobart' },
    ],
  },
  {
    label: 'Territories',
    options: [
      { label: 'Canberra', value: 'canberra' },
      { label: 'Darwin', value: 'darwin' },
    ],
  },
];

const onChange = console.log;
const defaults = {
  options,
  placeholder: 'Choose a city',
  'aria-label': 'Choose a City',
  onChange,
};

const PopupSelectExample = () => (
  <Fragment>
    <div css={{ display: 'flex', justifyContent: 'space-between' }}>
      <PopupSelect
        {...defaults}
        value={options[0].options[0]}
        target={({ isOpen, ...triggerProps }) => (
          <Button {...triggerProps} isSelected={isOpen}>
            Target
          </Button>
        )}
      />
      <PopupSelect
        {...defaults}
        target={({ isOpen, ...triggerProps }) => (
          <Button {...triggerProps} isSelected={isOpen}>
            W/O Search
          </Button>
        )}
        popperProps={{ placement: 'bottom', strategy: 'fixed' }}
        searchThreshold={10}
      />
      <PopupSelect
        {...defaults}
        target={({ isOpen, ...triggerProps }) => (
          <Button {...triggerProps} isSelected={isOpen}>
            Placement: &ldquo;right-start&rdquo; (flip)
          </Button>
        )}
        popperProps={{ placement: 'right-start' }}
      />
    </div>
    <div css={{ display: 'flex' }}>
      <div
        css={{
          background: token(
            'color.background.subtleNeutral.resting',
            'AliceBlue',
          ),
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
            <Button {...triggerProps} isSelected={isOpen}>
              Target
            </Button>
          )}
        />
      </div>
      <div css={{ margin: '1em' }}>
        <PopupSelect
          {...defaults}
          target={({ isOpen, ...triggerProps }) => (
            <Button
              {...triggerProps}
              isSelected={isOpen}
              iconAfter={<AppSwitcherIcon label="switcher" />}
            />
          )}
        />
      </div>
    </div>
  </Fragment>
);

export default PopupSelectExample;
