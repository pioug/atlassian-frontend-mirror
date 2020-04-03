/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { ThemeProvider, withTheme } from 'styled-components';
import { itemThemeNamespace } from '@atlaskit/item';
import AkDropdownMenu from '@atlaskit/dropdown-menu';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import memoizeOne from 'memoize-one';
import AkNavigationItem from './NavigationItem';
import ContainerTitleIcon from '../styled/ContainerTitleIcon';
import ContainerTitleText from '../styled/ContainerTitleText';
import { rootKey } from '../../theme/util';
import overrideItemTheme from '../../theme/create-container-title-item-theme';

const key = itemThemeNamespace;

class ContainerTitleDropdown extends PureComponent {
  withOuterTheme = memoizeOne(outerTheme => overrideItemTheme(outerTheme, key));

  render() {
    const {
      children,
      icon,
      subText,
      text,
      defaultDropdownOpen,
      isDropdownOpen,
      isDropdownLoading,
      onDropdownOpenChange,
    } = this.props;

    // theme is passed in via context and not part of the props API for this component
    const isNavCollapsed = this.props.theme[rootKey]
      ? this.props.theme[rootKey].isCollapsed
      : false;
    const theme = this.withOuterTheme(this.props.theme);
    /* eslint-enable react/prop-types */

    return (
      <AkDropdownMenu
        appearance="tall"
        shouldFitContainer={!isNavCollapsed}
        position={isNavCollapsed ? 'right top' : 'bottom left'}
        shouldFlip={false}
        defaultOpen={defaultDropdownOpen}
        isLoading={isDropdownLoading}
        isOpen={isDropdownOpen}
        onOpenChange={onDropdownOpenChange}
        trigger={
          <ThemeProvider theme={theme}>
            <AkNavigationItem
              dropIcon={isNavCollapsed ? null : <ExpandIcon label="chevron" />}
              isDropdownTrigger
              icon={
                isNavCollapsed ? null : (
                  <ContainerTitleIcon>{icon}</ContainerTitleIcon>
                )
              }
              subText={isNavCollapsed ? null : subText}
              text={
                isNavCollapsed ? (
                  <ContainerTitleIcon aria-label={text}>
                    {icon}
                  </ContainerTitleIcon>
                ) : (
                  <ContainerTitleText>{text}</ContainerTitleText>
                )
              }
            />
          </ThemeProvider>
        }
      >
        {children}
      </AkDropdownMenu>
    );
  }
}

export default withTheme(ContainerTitleDropdown);
