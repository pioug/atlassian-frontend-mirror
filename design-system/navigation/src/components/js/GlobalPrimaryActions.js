/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import GlobalItem from './GlobalItem';
import DrawerTrigger from './DrawerTrigger';
import GlobalPrimaryActionsList from './GlobalPrimaryActionsList';
import GlobalPrimaryActionsInner from '../styled/GlobalPrimaryActionsInner';
import GlobalPrimaryActionsPrimaryItem from '../styled/GlobalPrimaryActionsPrimaryItem';
import GlobalPrimaryActionsItemsWrapper from '../styled/GlobalPrimaryActionsItemsWrapper';

export default class GlobalPrimaryActions extends PureComponent {
  render() {
    const {
      actions,
      createIcon,
      linkComponent,
      onCreateActivate,
      onSearchActivate,
      primaryIcon,
      primaryIconAppearance,
      primaryItemHref,
      searchIcon,
    } = this.props;
    return (
      <GlobalPrimaryActionsInner>
        {primaryIcon ? (
          <GlobalPrimaryActionsPrimaryItem>
            <GlobalItem
              id="productLogo"
              href={primaryItemHref}
              linkComponent={linkComponent}
              size="medium"
              appearance={primaryIconAppearance}
            >
              {primaryIcon}
            </GlobalItem>
          </GlobalPrimaryActionsPrimaryItem>
        ) : null}

        <GlobalPrimaryActionsItemsWrapper>
          {actions ? (
            <GlobalPrimaryActionsList actions={actions} />
          ) : (
            <div>
              {searchIcon ? (
                <DrawerTrigger onActivate={onSearchActivate}>
                  {searchIcon}
                </DrawerTrigger>
              ) : null}
              {createIcon ? (
                <DrawerTrigger onActivate={onCreateActivate}>
                  {createIcon}
                </DrawerTrigger>
              ) : null}
            </div>
          )}
        </GlobalPrimaryActionsItemsWrapper>
      </GlobalPrimaryActionsInner>
    );
  }
}
