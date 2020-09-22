import React from 'react';
import styled from 'styled-components';
import { CustomThemeButtonProps } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';
import { N0, N500, N900 } from '@atlaskit/theme/colors';

export const FolderViewerNavigation: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  display: flex;
  justify-content: space-between;

  /* Ensure header has height */
  min-height: 60px;
  padding: 15px 13px;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: ${N0};
`;
FolderViewerNavigation.displayName = 'FolderViewerNavigation';

export const ControlsWrapper: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div``;

export const Controls: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  height: 30px;
  display: flex;
`;

export const ControlButton = (props: CustomThemeButtonProps) => (
  <Button
    {...props}
    theme={(currentTheme: any, themeProps: any) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          marginRight: '5px',
        },
        ...rest,
      };
    }}
  />
);

export const BreadCrumbs: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface BreadCrumbLinkLabelProps {
  isLast: boolean;
}

export const BreadCrumbLinkLabel: React.ComponentClass<
  React.HTMLAttributes<{}> & BreadCrumbLinkLabelProps
> = styled.span`
  &:hover {
    text-decoration: ${(props: BreadCrumbLinkLabelProps) =>
      props.isLast ? 'none' : 'underline'};
  }
`;

export const BreadCrumbLinkSeparator: React.ComponentClass<
  React.HTMLAttributes<{}> & BreadCrumbLinkLabelProps
> = styled.span`
  color: ${N500};
  display: ${(props: BreadCrumbLinkLabelProps) =>
    props.isLast ? 'none' : 'inline'};
  margin: 0 4px;
  text-decoration: none;
`;

export const BreadCrumbLink: React.ComponentClass<
  React.HTMLAttributes<{}> & BreadCrumbLinkLabelProps
> = styled.span`
  color: ${(props: BreadCrumbLinkLabelProps) => (props.isLast ? N900 : N500)};
  cursor: ${(props: BreadCrumbLinkLabelProps) =>
    props.isLast ? 'default' : 'pointer'};
  font-size: ${(props: BreadCrumbLinkLabelProps) =>
    props.isLast ? '20px' : '14px'};
`;

export const AccountItemButton = (props: CustomThemeButtonProps) => (
  <Button {...props} />
);

// Dropdown is NOT intentionally extended by this component to allow HACK style below to work
export const AccountDropdownWrapper: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  /* TODO: remove this when the ak-dropdown-menu package supports custom item types */
  span[role='presentation'] > span > span:first-child {
    display: none;
  }
`;
