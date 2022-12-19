/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/* eslint-disable @repo/internal/react/no-class-components */
import React, { ChangeEvent, Component } from 'react';

import Lorem from 'react-lorem-component';
import styled from 'styled-components';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import Box from '@atlaskit/ds-explorations/box';
import Inline from '@atlaskit/ds-explorations/inline';
import Stack from '@atlaskit/ds-explorations/stack';
import Text from '@atlaskit/ds-explorations/text';
import { N0, N900, subtleText } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

import { ProgressIndicator } from '../src';

type Appearances = 'default' | 'help' | 'inverted' | 'primary';
type Sizes = 'small' | 'default' | 'large';
type Spacing = 'comfortable' | 'cozy' | 'compact';

const appearances: Appearances[] = ['default', 'primary', 'help', 'inverted'];
const sizes: Sizes[] = ['small', 'default', 'large'];
const spacing: Spacing[] = ['comfortable', 'cozy', 'compact'];
const values = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];

const Footer = styled.div<{ appearance: string }>`
  background-color: ${(p) =>
    p.appearance === 'inverted'
      ? themed({
          light: token('color.background.neutral.bold', N900),
          dark: token('color.background.neutral', N0),
        })
      : null};
`;

const Heading = styled.div`
  color: ${subtleText};
  font-weight: ${token('font.weight.medium', '500')};
  text-transform: uppercase;
`;

const Page = styled.div`
  max-width: 840px;
  margin-inline: auto;
`;
const Input = styled.input``;

const SpreadInlineLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Inline gap="scale.100" justifyContent="space-between" alignItems="center">
      {children}
    </Inline>
  );
};

interface State {
  isInteractive: boolean;
  selectedIndex: number;
  selectedAppearance: Appearances;
  selectedSize: Sizes;
  selectedSpacing: 'comfortable' | 'cozy' | 'compact';
  themeIndex: number;
}

export default class ProgressIndicatorDots extends Component<{}, State> {
  state = {
    isInteractive: true,
    selectedIndex: 0,
    selectedAppearance: 'primary' as Appearances,
    selectedSize: 'default' as Sizes,
    selectedSpacing: 'comfortable' as Spacing,
    themeIndex: 0,
  };

  handlePrev = () => {
    this.setState((state) => ({ selectedIndex: state.selectedIndex - 1 }));
  };

  handleNext = () => {
    this.setState((state) => ({ selectedIndex: state.selectedIndex + 1 }));
  };
  /* eslint-disable */
  /* prettier-ignore */
  handleSelect = ({
    event,
    index: selectedIndex,
  }: {
    event: React.MouseEvent<HTMLButtonElement>;
    index: number;
  }): void => {
    this.setState({ selectedIndex });
  };

  /* eslint-enable */
  toggleAppearance = (
    selectedAppearance: 'default' | 'help' | 'inverted' | 'primary',
  ) => this.setState({ selectedAppearance });

  toggleSize = (selectedSize: 'small' | 'default' | 'large') =>
    this.setState({ selectedSize });

  toggleSpacing = (selectedSpacing: 'comfortable' | 'cozy' | 'compact') =>
    this.setState({ selectedSpacing });

  toggleInteractivity = (event: ChangeEvent<HTMLInputElement>) =>
    this.setState({ isInteractive: event.target.checked });

  render() {
    const {
      isInteractive,
      selectedAppearance,
      selectedIndex,
      selectedSpacing,
      selectedSize,
    } = this.state;

    return (
      <Page>
        <Box display="block" paddingBlock="scale.400">
          <Stack gap="scale.400">
            <SpreadInlineLayout>
              <Stack gap="scale.150">
                <Heading>Appearance</Heading>
                <ButtonGroup>
                  {appearances.map((app) => (
                    <Button
                      isSelected={selectedAppearance === app}
                      key={app}
                      onClick={() => this.toggleAppearance(app)}
                      spacing="compact"
                    >
                      {app}
                    </Button>
                  ))}
                </ButtonGroup>
              </Stack>
              <Stack gap="scale.150">
                <Heading>Spacing</Heading>
                <ButtonGroup>
                  {spacing.map((spc) => (
                    <Button
                      isSelected={selectedSpacing === spc}
                      key={spc}
                      onClick={() => this.toggleSpacing(spc)}
                      spacing="compact"
                    >
                      {spc}
                    </Button>
                  ))}
                </ButtonGroup>
              </Stack>
              <Stack gap="scale.150">
                <Heading>Size</Heading>
                <ButtonGroup>
                  {sizes.map((sz) => (
                    <Button
                      isSelected={selectedSize === sz}
                      key={sz}
                      onClick={() => this.toggleSize(sz)}
                      spacing="compact"
                    >
                      {sz}
                    </Button>
                  ))}
                </ButtonGroup>
              </Stack>
            </SpreadInlineLayout>
            <SpreadInlineLayout>
              <Box as="label" htmlFor="input">
                <Inline gap="scale.100" alignItems="center">
                  <Input
                    checked={isInteractive}
                    id="input"
                    onChange={this.toggleInteractivity}
                    type="checkbox"
                  />
                  <Text as="strong" fontWeight="700">
                    Allow interaction with indicators
                  </Text>
                </Inline>
              </Box>
            </SpreadInlineLayout>
            <Box display="block">
              {values.map((v, i) => {
                const selected = i === selectedIndex;
                const panelId = `panel${i}`;

                return (
                  <Box
                    display="block"
                    aria-hidden={!selected}
                    aria-labelledby={`tab${i}`}
                    key={v}
                    id={panelId}
                    role="tabpanel"
                    UNSAFE_style={{ display: selected ? 'block' : 'none' }}
                  >
                    <Stack gap="scale.100">
                      <Text as="strong" fontSize="14px" fontWeight="700">
                        Panel {i + 1}
                      </Text>
                      <Lorem count={3} />
                    </Stack>
                  </Box>
                );
              })}
            </Box>
            <Footer appearance={selectedAppearance}>
              <Box
                display="block"
                paddingBlock="scale.150"
                paddingInline="scale.100"
              >
                <SpreadInlineLayout>
                  <Button
                    isDisabled={selectedIndex === 0}
                    appearance={
                      selectedAppearance === 'inverted' ? 'primary' : 'default'
                    }
                    onClick={this.handlePrev}
                  >
                    Prev
                  </Button>
                  <ProgressIndicator
                    appearance={selectedAppearance}
                    onSelect={isInteractive ? this.handleSelect : undefined}
                    selectedIndex={selectedIndex}
                    size={selectedSize}
                    spacing={selectedSpacing}
                    values={values}
                  />
                  <Button
                    isDisabled={selectedIndex === values.length - 1}
                    appearance={
                      selectedAppearance === 'inverted' ? 'primary' : 'default'
                    }
                    onClick={this.handleNext}
                  >
                    Next
                  </Button>
                </SpreadInlineLayout>
              </Box>
            </Footer>
          </Stack>
        </Box>
      </Page>
    );
  }
}
