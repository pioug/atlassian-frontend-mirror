import React, { useState } from 'react';

import Button from '@atlaskit/button';
import {
  UNSAFE_Box as Box,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import type { ThemeModes } from '@atlaskit/theme/types';

import SectionMessage, { SectionMessageAction } from '../src';

const LIGHT = 'light';
const DARK = 'dark';

export default function ThemeExample() {
  const [themeMode, setThemeMode] = useState<ThemeModes>(DARK);
  const toggleMode = () => {
    setThemeMode(themeMode === LIGHT ? DARK : LIGHT);
  };

  return (
    <AtlaskitThemeProvider mode={themeMode}>
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
        <Text>
          You will rejoice to hear that no disaster has accompanied the
          commencement of an enterprise which you have regarded with such evil
          forebodings. I arrived here yesterday, and my first task is to assure
          my dear sister of my welfare and increasing confidence in the success
          of my undertaking.
        </Text>
      </SectionMessage>
      <SectionMessage
        appearance="discovery"
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
        <Text>
          You will rejoice to hear that no disaster has accompanied the
          commencement of an enterprise which you have regarded with such evil
          forebodings. I arrived here yesterday, and my first task is to assure
          my dear sister of my welfare and increasing confidence in the success
          of my undertaking.
        </Text>
      </SectionMessage>
      <SectionMessage
        appearance="success"
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
        <Text>
          You will rejoice to hear that no disaster has accompanied the
          commencement of an enterprise which you have regarded with such evil
          forebodings. I arrived here yesterday, and my first task is to assure
          my dear sister of my welfare and increasing confidence in the success
          of my undertaking.
        </Text>
      </SectionMessage>
      <SectionMessage
        appearance="error"
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
        <Text>
          You will rejoice to hear that no disaster has accompanied the
          commencement of an enterprise which you have regarded with such evil
          forebodings. I arrived here yesterday, and my first task is to assure
          my dear sister of my welfare and increasing confidence in the success
          of my undertaking.
        </Text>
      </SectionMessage>
      <SectionMessage
        appearance="warning"
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
        <Text>
          You will rejoice to hear that no disaster has accompanied the
          commencement of an enterprise which you have regarded with such evil
          forebodings. I arrived here yesterday, and my first task is to assure
          my dear sister of my welfare and increasing confidence in the success
          of my undertaking.
        </Text>
      </SectionMessage>
      <Box paddingBlock="space.050">
        <Button testId="toggle-theme" onClick={toggleMode}>
          Toggle theme
        </Button>
      </Box>
    </AtlaskitThemeProvider>
  );
}
