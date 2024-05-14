import React, { useState } from 'react';

import __noop from '@atlaskit/ds-lib/noop';
import { FlagsProvider, useFlags } from '@atlaskit/flag';
import Heading from '@atlaskit/heading';
import CheckIcon from '@atlaskit/icon/glyph/check';
import Info from '@atlaskit/icon/glyph/info';
import InteractionContext from '@atlaskit/interaction-context';
import { ZoomIn } from '@atlaskit/motion';
import { Box, Inline, Pressable, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

const baseStyles = xcss({
  borderWidth: 'border.width',
  borderStyle: 'solid',
  borderColor: 'color.border',
  borderRadius: 'border.radius',
  height: '44px',
  width: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

type ColorButtonProps = {
  color: keyof typeof colorMap;
  isSelected?: boolean;
  onClick?(): void;
};

const ColorButton = ({ color, isSelected, onClick }: ColorButtonProps) => {
  return (
    <Tooltip content={color}>
      <Pressable
        interactionName={`color-${color.toLowerCase()}`}
        xcss={[baseStyles, colorMap[color]]}
        aria-pressed={isSelected}
        onClick={onClick}
      >
        {isSelected && (
          <ZoomIn>
            {props => (
              <div {...props}>
                <CheckIcon
                  label=""
                  size="large"
                  primaryColor={token('color.icon.inverse')}
                />
              </div>
            )}
          </ZoomIn>
        )}
        <VisuallyHidden>{color}</VisuallyHidden>
      </Pressable>
    </Tooltip>
  );
};

const ColorPaletteButtons = () => {
  const [selectedColor, setSelectedColor] = useState<
    keyof typeof colorMap | null
  >('Red');

  const { showFlag } = useFlags();

  return (
    <InteractionContext.Provider
      value={{
        hold: __noop,
        tracePress: name => {
          showFlag({
            title: `Traced a press!`,
            description: name,
            icon: (
              <Info
                label="Info"
                primaryColor={token('color.icon.information')}
              />
            ),
            isAutoDismiss: true,
          });
        },
      }}
    >
      <Stack space="space.150" alignInline="start">
        <Heading size="small" id="epic-heading">
          Change epic color
        </Heading>
        <Box role="group" aria-labelledby="epic-heading">
          <Inline space="space.100">
            {Object.keys(colorMap).map(color => {
              const keyColor = color as keyof typeof colorMap;
              return (
                <ColorButton
                  key={keyColor}
                  color={keyColor}
                  isSelected={selectedColor === keyColor}
                  onClick={() => setSelectedColor(keyColor)}
                />
              );
            })}
          </Inline>
        </Box>
      </Stack>
    </InteractionContext.Provider>
  );
};

export default function PressTracing() {
  return (
    <FlagsProvider>
      <ColorPaletteButtons />
    </FlagsProvider>
  );
}

const colorMap = {
  Red: xcss({
    backgroundColor: 'color.background.accent.red.subtle',

    ':hover': {
      backgroundColor: 'color.background.accent.red.subtle.hovered',
    },
    ':active': {
      backgroundColor: 'color.background.accent.red.subtle.pressed',
    },
  }),
  Orange: xcss({
    backgroundColor: 'color.background.accent.orange.subtle',

    ':hover': {
      backgroundColor: 'color.background.accent.orange.subtle.hovered',
    },
    ':active': {
      backgroundColor: 'color.background.accent.orange.subtle.pressed',
    },
  }),
  Yellow: xcss({
    backgroundColor: 'color.background.accent.yellow.subtle',

    ':hover': {
      backgroundColor: 'color.background.accent.yellow.subtle.hovered',
    },
    ':active': {
      backgroundColor: 'color.background.accent.yellow.subtle.pressed',
    },
  }),
  Lime: xcss({
    backgroundColor: 'color.background.accent.lime.subtle',

    ':hover': {
      backgroundColor: 'color.background.accent.lime.subtle.hovered',
    },
    ':active': {
      backgroundColor: 'color.background.accent.lime.subtle.pressed',
    },
  }),
  Green: xcss({
    backgroundColor: 'color.background.accent.green.subtle',

    ':hover': {
      backgroundColor: 'color.background.accent.green.subtle.hovered',
    },
    ':active': {
      backgroundColor: 'color.background.accent.green.subtle.pressed',
    },
  }),
  Teal: xcss({
    backgroundColor: 'color.background.accent.teal.subtle',

    ':hover': {
      backgroundColor: 'color.background.accent.teal.subtle.hovered',
    },
    ':active': {
      backgroundColor: 'color.background.accent.teal.subtle.pressed',
    },
  }),
  Blue: xcss({
    backgroundColor: 'color.background.accent.blue.subtle',

    ':hover': {
      backgroundColor: 'color.background.accent.blue.subtle.hovered',
    },
    ':active': {
      backgroundColor: 'color.background.accent.blue.subtle.pressed',
    },
  }),
  Purple: xcss({
    backgroundColor: 'color.background.accent.purple.subtle',

    ':hover': {
      backgroundColor: 'color.background.accent.purple.subtle.hovered',
    },
    ':active': {
      backgroundColor: 'color.background.accent.purple.subtle.pressed',
    },
  }),
  Magenta: xcss({
    backgroundColor: 'color.background.accent.magenta.subtle',

    ':hover': {
      backgroundColor: 'color.background.accent.magenta.subtle.hovered',
    },
    ':active': {
      backgroundColor: 'color.background.accent.magenta.subtle.pressed',
    },
  }),
};
