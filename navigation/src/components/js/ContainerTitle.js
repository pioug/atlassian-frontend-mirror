/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { ThemeProvider, withTheme } from 'styled-components';
import { itemThemeNamespace } from '@atlaskit/item';
import memoizeOne from 'memoize-one';
import AkNavigationItem from './NavigationItem';
import ContainerTitleIcon from '../styled/ContainerTitleIcon';
import ContainerTitleText from '../styled/ContainerTitleText';
import { rootKey } from '../../theme/util';
import overrideItemTheme from '../../theme/create-container-title-item-theme';

const key = itemThemeNamespace;

class ContainerTitle extends PureComponent {
  withOuterTheme = memoizeOne(outerTheme => overrideItemTheme(outerTheme, key));

  render() {
    const { text, subText, icon } = this.props;

    // theme is passed in via context and not part of the props API for this component
    const isNavCollapsed = this.props.theme[rootKey]
      ? this.props.theme[rootKey].isCollapsed
      : false;
    const theme = this.withOuterTheme(this.props.theme);

    const interactiveWrapperProps = {
      onClick: this.props.onClick,
      onKeyDown: this.props.onKeyDown,
      onMouseEnter: this.props.onMouseEnter,
      onMouseLeave: this.props.onMouseLeave,
      href: this.props.href,
      linkComponent: this.props.linkComponent,
    };

    return (
      <ThemeProvider theme={theme}>
        <AkNavigationItem
          icon={
            isNavCollapsed ? null : (
              <ContainerTitleIcon>{icon}</ContainerTitleIcon>
            )
          }
          subText={isNavCollapsed ? null : subText}
          text={
            isNavCollapsed ? (
              <ContainerTitleIcon aria-label={text}>{icon}</ContainerTitleIcon>
            ) : (
              <ContainerTitleText>{text}</ContainerTitleText>
            )
          }
          {...interactiveWrapperProps}
        />
      </ThemeProvider>
    );
  }
}

export default withTheme(ContainerTitle);
