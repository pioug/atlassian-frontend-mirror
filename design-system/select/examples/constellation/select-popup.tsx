/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/react';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import { token } from '@atlaskit/tokens';
import { Checkbox } from '@atlaskit/checkbox';
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

const PopupSelectExample = () => {
  const [defaultIsOpen, setDefaultIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(true);

  const remount = () => {
    setMounted(false);
    setTimeout(() => {
      setMounted(true);
    }, 50);
  };

  return (
    <div
      css={{
        display: 'grid',
        gap: token('space.200', '16px'),
      }}
    >
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
            <Button
              {...triggerProps}
              isSelected={isOpen}
              iconAfter={<AppSwitcherIcon label="switcher" />}
            />
          )}
        />
        <PopupSelect
          {...defaults}
          target={({ isOpen, ...triggerProps }) => (
            <Button {...triggerProps} isSelected={isOpen}>
              W/O Search
            </Button>
          )}
          popperProps={{ placement: 'bottom' }}
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
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '250px auto',
          gap: token('space.200', '16px'),
        }}
      >
        <div
          css={{
            background: token('color.background.neutral', 'AliceBlue'),
            padding: '1em',
            height: 500,
            overflowY: 'auto',
          }}
        >
          <h3>Scroll Container</h3>
          <div css={{ marginTop: 400, marginBottom: 400 }}>
            <PopupSelect
              {...defaults}
              target={({ isOpen, ...triggerProps }) => (
                <Button {...triggerProps} isSelected={isOpen}>
                  Target
                </Button>
              )}
            />
          </div>
        </div>
        <div>
          <div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3>Control open state</h3>
            <Button appearance="link" onClick={remount}>
              Remount
            </Button>
          </div>
          <div
            css={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <div>
              <h4>Uncontrolled</h4>
              <Checkbox
                value="defaultIsOpen"
                name="toggleValue"
                isChecked={defaultIsOpen}
                onChange={(e) => setDefaultIsOpen(e.currentTarget.checked)}
                label={<code>defaultIsOpen</code>}
              />
              {mounted && (
                <PopupSelect
                  {...defaults}
                  defaultIsOpen={defaultIsOpen}
                  target={({ isOpen, ...triggerProps }) => (
                    <Button {...triggerProps}>Target</Button>
                  )}
                />
              )}
            </div>
            <div>
              <h4>Controlled</h4>
              <Checkbox
                value="isOpen"
                name="toggleValue"
                isChecked={isOpen}
                onChange={(e) => setIsOpen(e.currentTarget.checked)}
                label={<code>isOpen</code>}
              />
              {mounted && (
                <PopupSelect
                  {...defaults}
                  isOpen={isOpen}
                  target={({ isOpen, ...triggerProps }) => (
                    <span {...triggerProps}></span>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupSelectExample;
