/** @jsx jsx */
import { jsx } from '@emotion/react';

import AddIcon from '@atlaskit/icon/glyph/add';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import LightbulbIcon from '@atlaskit/icon/glyph/lightbulb';
import MoreIcon from '@atlaskit/icon/glyph/more';
import { Box, Stack } from '@atlaskit/primitives';
import VisuallyHidden from '@atlaskit/visually-hidden';

import Button from '../src';

const ButtonOptions = () => (
  <Box paddingInline="space.400" paddingBlock="space.200">
    <Stack space="space.050">
      <Box padding="space.050">
        <Button iconAfter={<ChevronDownIcon label="" />}>Ready</Button>
      </Box>
      <Box padding="space.050">
        <Button iconAfter={<ChevronDownIcon label="" />} spacing="compact">
          Agile Poker
        </Button>
      </Box>
      <Box padding="space.050">
        <Button iconAfter={<ChevronDownIcon label="" />} appearance="primary">
          Create
        </Button>
      </Box>
      <Box padding="space.050">
        <Button
          iconAfter={<ChevronDownIcon label="" />}
          appearance="primary"
          spacing="compact"
        >
          Create
        </Button>
      </Box>
      <Box padding="space.050">
        <Button iconAfter={<ChevronDownIcon label="" />}>Bug reported</Button>
      </Box>
      <Box padding="space.050">
        <Button iconAfter={<ChevronDownIcon label="" />} appearance="subtle">
          More
        </Button>
      </Box>
      <Box padding="space.050">
        <Button iconAfter={<ChevronDownIcon label="" />} appearance="subtle">
          Epic Label
        </Button>
      </Box>
      <Box padding="space.050">
        <Button iconAfter={<ArrowRightIcon label="" />}>Button</Button>
      </Box>
      <Box padding="space.050">
        <Button iconAfter={<ArrowRightIcon label="" />} appearance="primary">
          Button
        </Button>
      </Box>
      <Box padding="space.050">
        <Button iconAfter={<MoreIcon label="" size="small" />}>Update</Button>
      </Box>
      <Box padding="space.050">
        <Button iconAfter={<MoreIcon label="" />}>Update</Button>
      </Box>
      <Box padding="space.050">
        <Button iconBefore={<AddIcon label="" />} appearance="primary">
          Create new
        </Button>
      </Box>
      <Box padding="space.050">
        <Button iconBefore={<AddIcon label="" />} appearance="primary">
          <VisuallyHidden>Create new</VisuallyHidden>
        </Button>
      </Box>
      <Box padding="space.050">
        <Button
          iconBefore={<AddIcon label="" />}
          appearance="primary"
          aria-label="Create new"
        />
      </Box>
      <Box padding="space.050">
        <Button iconBefore={<ArrowLeftIcon label="" />}>Back</Button>
      </Box>
      <Box padding="space.050">
        <Button iconBefore={<ArrowLeftIcon label="" />} appearance="subtle">
          Back
        </Button>
      </Box>
      <Box padding="space.050">
        <Button iconAfter={<GraphLineIcon label="" />}>Insights</Button>
      </Box>
      <Box padding="space.050">
        <Button
          iconBefore={<LightbulbIcon label="" />}
          iconAfter={<ChevronDownIcon label="" />}
        >
          Enhance
        </Button>
      </Box>
    </Stack>
  </Box>
);

export default ButtonOptions;
