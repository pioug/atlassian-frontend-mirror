import React, { Component, ComponentType } from 'react';

import uuid from 'uuid/v1';

import Button, { ButtonAppearances } from '@atlaskit/button';
import { ButtonProps } from '@atlaskit/button/types';

import { DEFAULT_APPEARANCE } from '../../constants';
import { actionButtonStyles, getPseudos } from '../../theme';
import { ActionsType, AppearanceTypes } from '../../types';

import Container, { Action } from './styledFlagActions';

type Props = {
  appearance: AppearanceTypes;
  actions: ActionsType;
  linkComponent?: ComponentType<ButtonProps>;
};

export default class FlagActions extends Component<Props, {}> {
  // eslint-disable-line react/sort-comp
  static defaultProps = {
    appearance: DEFAULT_APPEARANCE,
    actions: [],
  };

  getUniqueId = (prefix: string): string => `${prefix}-${uuid()}`;

  render() {
    const { actions, appearance, linkComponent } = this.props;
    const isBold = appearance !== DEFAULT_APPEARANCE;

    if (!actions.length) return null;
    return (
      <Container appearance={appearance}>
        {actions.map((action, index) => (
          <Action
            key={this.getUniqueId('flag-action')}
            hasDivider={!!index}
            useMidDot={!isBold}
            data-testid={action.testId}
          >
            <Button
              onClick={action.onClick}
              href={action.href}
              target={action.target}
              // This is very much a hack
              // This should be tidied up when the appearance prop
              // of flag is aligned with other appearance props.
              appearance={
                appearance === 'normal'
                  ? 'link'
                  : (appearance as ButtonAppearances)
              }
              component={linkComponent}
              spacing="compact"
              data-testid={action.testId}
              theme={(adgTheme, themeProps) => {
                const { buttonStyles, ...rest } = adgTheme(themeProps);
                return {
                  buttonStyles: {
                    ...buttonStyles,
                    ...actionButtonStyles({
                      appearance,
                      mode: themeProps.mode,
                    }),
                    ...getPseudos({ appearance, mode: themeProps.mode }),
                  },
                  ...rest,
                };
              }}
            >
              {action.content}
            </Button>
          </Action>
        ))}
      </Container>
    );
  }
}
