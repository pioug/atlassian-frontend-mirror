import React, { FC, useState } from 'react';

import { AVATAR_SIZES, SizeType } from '@atlaskit/avatar';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
// eslint-disable-next-line
import { Label } from '@atlaskit/field-base';
import ArrowDown from '@atlaskit/icon/glyph/arrow-down';
import ArrowUp from '@atlaskit/icon/glyph/arrow-up';
import Toggle from '@atlaskit/toggle';

import { Code, Note } from '../examples-util/helpers';
import AvatarGroup from '../src';

type State = {
  avatarCount: number;
  avatarCountMax: number;
  gridWidth: number;
  mode: 'stack' | 'grid';
  sizeIndex: number;
  isTooltipsDisabled: boolean;
};

const AvatarGroupExample: FC = () => {
  const [state, setState] = useState<State>({
    avatarCount: 20,
    avatarCountMax: 11,
    gridWidth: 220,
    mode: 'stack',
    sizeIndex: 3,
    isTooltipsDisabled: false,
  });

  const decrement = (key: keyof Omit<State, 'mode' | 'isTooltipsDisabled'>) => {
    setState({
      ...state,
      [key]: state[key] - 1,
    });
  };

  const increment = (key: keyof Omit<State, 'mode' | 'isTooltipsDisabled'>) => {
    setState({
      ...state,
      [key]: state[key] + 1,
    });
  };

  const toggleTooltips = () => {
    setState({
      ...state,
      isTooltipsDisabled: !state.isTooltipsDisabled,
    });
  };

  const { avatarCount, avatarCountMax, gridWidth, mode, sizeIndex } = state;
  const sizes = Object.keys(AVATAR_SIZES) as SizeType[];
  const avatarSize = sizes[sizeIndex];
  const stackSourceURLs = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < avatarCount; i++) {
    stackSourceURLs.push(i);
  }

  return (
    <div>
      <Note size="large">
        Click the excess indicator to see the remaining avatars in a dropdown
        menu.
      </Note>
      <div style={{ display: 'flex', marginTop: '1em' }}>
        <div style={{ flex: 1 }}>
          <h5 style={{ marginBottom: '0.5em' }}>Avatar Size: {avatarSize}</h5>
          <ButtonGroup>
            <Button
              isDisabled={avatarSize === 'small'}
              onClick={() => decrement('sizeIndex')}
              iconBefore={<ArrowDown size="small" label="Smaller" />}
            >
              Smaller
            </Button>
            <Button
              isDisabled={avatarSize === 'xlarge'}
              onClick={() => increment('sizeIndex')}
              iconBefore={<ArrowUp size="small" label="Larger" />}
            >
              Larger
            </Button>
          </ButtonGroup>
        </div>
        <div style={{ flex: 1 }}>
          <h5 style={{ marginBottom: '0.5em' }}>Avatar Count: {avatarCount}</h5>
          <ButtonGroup>
            <Button
              isDisabled={avatarCount <= 1}
              onClick={() => decrement('avatarCount')}
              iconBefore={<ArrowDown size="small" label="Less" />}
            >
              Less
            </Button>
            <Button
              isDisabled={avatarCount >= 30}
              onClick={() => increment('avatarCount')}
              iconBefore={<ArrowUp size="small" label="More" />}
            >
              More
            </Button>
          </ButtonGroup>
        </div>
        <div style={{ flex: 1 }}>
          <h5 style={{ marginBottom: '0.5em' }}>Grid Max: {avatarCountMax}</h5>
          <ButtonGroup>
            <Button
              isDisabled={avatarCountMax <= 1}
              onClick={() => decrement('avatarCountMax')}
              iconBefore={<ArrowDown size="small" label="Less" />}
            >
              Less
            </Button>
            <Button
              isDisabled={avatarCountMax >= 30}
              onClick={() => increment('avatarCountMax')}
              iconBefore={<ArrowUp size="small" label="More" />}
            >
              More
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <h5>Grid</h5>
      <Note>
        Total {stackSourceURLs.length} / Max {avatarCountMax}
      </Note>
      <input
        min="200"
        max="500"
        onChange={(e) =>
          setState({ ...state, gridWidth: parseInt(e.target.value, 10) })
        }
        step="10"
        title="Grid Width"
        type="range"
        value={gridWidth}
      />
      <div style={{ maxWidth: gridWidth, position: 'relative' }}>
        <AvatarGroup
          appearance="grid"
          onAvatarClick={console.log}
          data={stackSourceURLs.map((i) => ({
            key: i,
            appearance: 'circle',
            href: '#',
            name: `Grid Avatar ${i + 1}`,
            size: avatarSize,
            onClick: (e) => console.log(e),
          }))}
          maxCount={avatarCountMax}
          size={avatarSize}
          testId="grid"
        />
        <span
          style={{
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            borderLeft: '1px solid #ccc',
            paddingLeft: '1em',
            fontSize: 11,
            position: 'absolute',
            right: 0,
            top: 0,

            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            color: '#999',
            transform: 'translateX(100%)',
          }}
        >
          {gridWidth}px
        </span>
      </div>
      <h5>Stack</h5>
      <Note>Total {stackSourceURLs.length} / Max 5</Note>
      <AvatarGroup
        onAvatarClick={console.log}
        data={stackSourceURLs.map((i) => ({
          key: i,
          href: '#',
          name: `Stack Avatar ${i + 1}`,
          size: avatarSize,
          appearance: 'circle',
        }))}
        size={avatarSize}
      />

      <h5>On {'"More"'} Click</h5>
      <div style={{ maxWidth: 380 }}>
        <Note>
          Circumvent the default dropdown menu behaviour by passing{' '}
          <Code>onMoreClick</Code> to <Code>{'<AvatarGroup />'}</Code> and
          handle the event however you want.
        </Note>
        <AvatarGroup
          onMoreClick={() => setState({ ...state, mode: 'grid' })}
          appearance={mode}
          maxCount={mode === 'grid' ? avatarCount : undefined}
          data={stackSourceURLs.map((i) => ({
            key: i,
            href: '#',
            name: `Stack Avatar ${i + 1}`,
            size: avatarSize,
            appearance: 'circle',
          }))}
          size={avatarSize}
        />
        {mode === 'grid' ? (
          <button
            type="button"
            onClick={() => setState({ ...state, mode: 'stack' })}
          >
            reset
          </button>
        ) : null}
      </div>

      <h5>Removed from tab order</h5>
      <div style={{ maxWidth: 380 }}>
        <Note>
          Prevent tabbing to elements in the avatar group by passing{' '}
          <Code>tabIndex</Code> via the <Code>showMoreButtonProps</Code> and{' '}
          <Code>data</Code> props.
        </Note>
        <AvatarGroup
          appearance="stack"
          maxCount={5}
          data={stackSourceURLs.map((i) => ({
            appearance: 'circle',
            href: '#',
            key: i,
            name: `Stack Avatar ${i + 1}`,
            size: avatarSize,
            tabIndex: -1,
          }))}
          size={avatarSize}
          showMoreButtonProps={{ tabIndex: -1 }}
        />
      </div>

      <h5>Constrained by the scroll parent</h5>
      <div>
        <p>Expand and scroll up to reposition the avatar group menu</p>
        <div
          style={{
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            border: '1px solid black',
            height: '200px',
            width: '300px',
            overflow: 'scroll',
          }}
        >
          <div style={{ width: '300px', height: '600px', paddingTop: '200px' }}>
            <AvatarGroup
              boundariesElement="scrollParent"
              onAvatarClick={console.log}
              data={stackSourceURLs.slice(0, 6).map((i) => ({
                href: '#',
                key: i,
                name: `Stack Avatar ${i + 1}`,
                size: avatarSize,
                appearance: 'circle',
              }))}
            />
          </div>
        </div>
      </div>

      <h5>Non-interactive</h5>
      <div>
        <Label label="Enable tooltips" />
        <Toggle
          isChecked={!state.isTooltipsDisabled}
          onChange={toggleTooltips}
        />
        <AvatarGroup
          data={stackSourceURLs.map((i) => ({
            key: i,
            name: `Stack Avatar ${i + 1}`,
            size: avatarSize,
            appearance: 'circle',
            enableTooltip: !state.isTooltipsDisabled,
          }))}
          size={avatarSize}
        />
      </div>
    </div>
  );
};

export default AvatarGroupExample;
