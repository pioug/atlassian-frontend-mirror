import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import { Box, Flex, Grid, Inline, Stack, Text } from '../../../index';
import UNSAFE_ANCHOR from '../../anchor';
import Pressable from '../../pressable';

describe('Primitives', () => {
  describe('Anchor', () => {
    it('should pass an aXe audit', async () => {
      const { container } = render(
        <UNSAFE_ANCHOR href="/home">Anchor</UNSAFE_ANCHOR>,
      );
      await axe(container);
    });
  });

  describe('Box', () => {
    it('should pass an aXe audit', async () => {
      const { container } = render(<Box>Box</Box>);
      await axe(container);
    });

    it('should pass an aXe audit when using `as`', async () => {
      const { container } = render(<Box as="span">Box</Box>);
      await axe(container);
    });
  });

  describe('Flex', () => {
    it('should pass an aXe audit', async () => {
      const { container } = render(<Flex>Grid</Flex>);
      await axe(container);
    });

    it('should pass an aXe audit when using `as`', async () => {
      const { container } = render(<Flex as="span">Grid</Flex>);
      await axe(container);
    });
  });

  describe('Grid', () => {
    it('should pass an aXe audit', async () => {
      const { container } = render(<Grid>Grid</Grid>);
      await axe(container);
    });

    it('should pass an aXe audit when using `as`', async () => {
      const { container } = render(<Grid as="span">Grid</Grid>);
      await axe(container);
    });

    it('should pass an aXe audit when nested', async () => {
      const { container } = render(
        <Grid
          testId="parent"
          templateAreas={['header']}
          templateColumns="2fr"
          templateRows="1fr"
        >
          <Grid testId="child" templateRows="100px">
            Child
          </Grid>
        </Grid>,
      );
      await axe(container);
    });
  });

  describe('Inline', () => {
    it('should pass an aXe audit', async () => {
      const { container } = render(
        <Inline space="space.050">
          <Box>1</Box>
          <Box>2</Box>
        </Inline>,
      );
      await axe(container);
    });

    it('should pass an aXe audit with separator', async () => {
      const { container } = render(
        <Inline space="space.050" separator="/">
          <Box>1</Box>
          <Box>2</Box>
        </Inline>,
      );
      await axe(container);
    });
  });

  describe('Pressable', () => {
    it('should pass an aXe audit', async () => {
      const { container } = render(<Pressable>Pressable</Pressable>);
      await axe(container);
    });
  });

  describe('Stack', () => {
    it('should pass an aXe audit', async () => {
      const { container } = render(
        <Stack space="space.050">
          <Box>1</Box>
          <Box>2</Box>
        </Stack>,
      );
      await axe(container);
    });
  });

  describe('Text', () => {
    it('should pass an aXe audit', async () => {
      const { container } = render(<Text>Text</Text>);
      await axe(container);
    });

    it('should pass an aXe audit when using `as`', async () => {
      const { container } = render(<Text as="span">Text</Text>);
      await axe(container);
    });
  });
});
