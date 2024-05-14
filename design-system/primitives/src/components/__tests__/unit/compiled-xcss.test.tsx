import React from 'react';

import { render, screen } from '@testing-library/react';

import { cssMap } from '@atlaskit/css';

import {
  UNSAFE_ANCHOR as Anchor,
  Bleed,
  Box,
  Flex,
  Grid,
  Inline,
  Pressable,
  Stack,
} from '../../../index';

const styles = cssMap({
  color: { color: 'var(--ds-text)' },
});

describe('compiled xcss styles', () => {
  it('should set compiled styles to the Bleed component', () => {
    render(
      <Bleed testId="bleed" block="space.025" xcss={styles.color}>
        <div />
      </Bleed>,
    );

    expect(screen.getByTestId('bleed')).toHaveCompiledCss({
      color: 'var(--ds-text)',
      marginBlock: 'var(--ds-space-negative-025, -0.125rem)',
    });
  });

  it('should set compiled styles to the Box component', () => {
    render(
      <Box
        backgroundColor="color.background.neutral"
        testId="box"
        xcss={styles.color}
      >
        <div />
      </Box>,
    );

    expect(screen.getByTestId('box')).toHaveCompiledCss({
      color: 'var(--ds-text)',
      backgroundColor: 'var(--ds-background-neutral, #DFE1E6)',
    });
  });

  it('should set compiled styles to the Flex component', () => {
    render(
      <Flex alignItems="center" testId="flex" xcss={styles.color}>
        <div />
      </Flex>,
    );

    expect(screen.getByTestId('flex')).toHaveCompiledCss({
      color: 'var(--ds-text)',
      alignItems: 'center',
    });
  });

  it('should set compiled styles to the Grid component', () => {
    render(
      <Grid alignItems="center" testId="grid" xcss={styles.color}>
        <div />
      </Grid>,
    );

    expect(screen.getByTestId('grid')).toHaveCompiledCss({
      color: 'var(--ds-text)',
      alignItems: 'center',
    });
  });

  it('should set compiled styles to the Inline component', () => {
    render(
      <Inline grow="fill" testId="inline" xcss={styles.color}>
        <div />
      </Inline>,
    );

    expect(screen.getByTestId('inline')).toHaveCompiledCss({
      color: 'var(--ds-text)',
      flexGrow: '1',
    });
  });

  it('should set compiled styles to the Stack component', () => {
    render(
      <Stack grow="fill" testId="stack" xcss={styles.color}>
        <div />
      </Stack>,
    );

    expect(screen.getByTestId('stack')).toHaveCompiledCss({
      color: 'var(--ds-text)',
      flexGrow: '1',
    });
  });

  it('should set compiled styles to the Anchor component', () => {
    render(
      <Anchor href="#" testId="anchor" xcss={styles.color}>
        Foobar
      </Anchor>,
    );

    expect(screen.getByTestId('anchor')).toHaveCompiledCss({
      color: 'var(--ds-text)',
      textDecoration: 'underline',
    });
  });

  it('should set compiled styles to the Pressable component', () => {
    render(
      <Pressable testId="pressable" xcss={styles.color}>
        Foobar
      </Pressable>,
    );

    expect(screen.getByTestId('pressable')).toHaveCompiledCss({
      color: 'var(--ds-text)',
      cursor: 'pointer',
    });
  });
});
