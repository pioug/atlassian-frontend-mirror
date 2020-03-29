/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { WithRootTheme } from '../../theme/util';
import GlobalPrimaryActions from './GlobalPrimaryActions';
import GlobalSecondaryActions from './GlobalSecondaryActions';
import GlobalNavigationInner from '../styled/GlobalNavigationInner';
import GlobalNavigationPrimaryContainer from '../styled/GlobalNavigationPrimaryContainer';
import GlobalNavigationSecondaryContainer from '../styled/GlobalNavigationSecondaryContainer';
import { global } from '../../theme/presets';

export default class GlobalNavigation extends PureComponent {
  static defaultProps = {
    primaryIconAppearance: 'round',
    secondaryActions: [],
    theme: global,
  };

  render() {
    const {
      createIcon,
      linkComponent,
      onCreateActivate,
      onSearchActivate,
      primaryActions,
      primaryIcon,
      primaryIconAppearance,
      primaryItemHref,
      searchIcon,
      secondaryActions,
      theme,
    } = this.props;

    return (
      <WithRootTheme provided={theme}>
        <GlobalNavigationInner>
          <GlobalNavigationPrimaryContainer>
            <GlobalPrimaryActions
              actions={primaryActions}
              createIcon={createIcon}
              linkComponent={linkComponent}
              onCreateActivate={onCreateActivate}
              onSearchActivate={onSearchActivate}
              primaryIcon={primaryIcon}
              primaryIconAppearance={primaryIconAppearance}
              primaryItemHref={primaryItemHref}
              searchIcon={searchIcon}
            />
          </GlobalNavigationPrimaryContainer>
          <GlobalNavigationSecondaryContainer>
            {secondaryActions.length ? (
              <GlobalSecondaryActions actions={secondaryActions} />
            ) : null}
          </GlobalNavigationSecondaryContainer>
        </GlobalNavigationInner>
      </WithRootTheme>
    );
  }
}
