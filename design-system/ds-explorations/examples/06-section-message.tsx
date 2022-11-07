/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import __noop from '@atlaskit/ds-lib/noop';
import Heading from '@atlaskit/heading';
import InfoIcon from '@atlaskit/icon/glyph/info';
import SectionMessage, {
  SectionMessageAction,
} from '@atlaskit/section-message';
import { token } from '@atlaskit/tokens';

import { UNSAFE_Box as Box } from '../src';
import Inline from '../src/components/inline.partial';
import Stack from '../src/components/stack.partial';
import Text from '../src/components/text.partial';

export default () => {
  return (
    <Stack gap="scale.100">
      <Box
        paddingBlock="scale.200"
        paddingInline="scale.200"
        backgroundColor="information"
      >
        <Inline gap="scale.200">
          <InfoIcon
            primaryColor={token('color.icon.information')}
            label="info"
          />
          <Stack gap="scale.100">
            <Heading as="h1" level="h500">
              The Modern Prometheus
            </Heading>
            <Text>
              You will rejoice to hear that no disaster has accompanied the
              commencement of an enterprise which you have regarded with such
              evil forebodings. I arrived here yesterday, and my first task is
              to assure my dear sister of my welfare and increasing confidence
              in the success of my undertaking.
            </Text>
            <Inline divider="·" gap="scale.075">
              <Button
                appearance="link"
                spacing="none"
                href="https://en.wikipedia.org/wiki/Mary_Shelley"
              >
                Mary
              </Button>
              <Button
                appearance="link"
                spacing="none"
                href="https://en.wikipedia.org/wiki/Villa_Diodati"
              >
                Villa Diodatti
              </Button>
            </Inline>
          </Stack>
        </Inline>
      </Box>
      <SectionMessage
        testId="section-message"
        title="The Modern Prometheus"
        actions={[
          <SectionMessageAction href="https://en.wikipedia.org/wiki/Mary_Shelley">
            Mary
          </SectionMessageAction>,
          <SectionMessageAction href="https://en.wikipedia.org/wiki/Villa_Diodati">
            Villa Diodatti
          </SectionMessageAction>,
        ]}
      >
        <p>
          You will rejoice to hear that no disaster has accompanied the
          commencement of an enterprise which you have regarded with such evil
          forebodings. I arrived here yesterday, and my first task is to assure
          my dear sister of my welfare and increasing confidence in the success
          of my undertaking.
        </p>
      </SectionMessage>
    </Stack>
  );
};
