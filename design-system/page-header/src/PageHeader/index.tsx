import React, { ReactElement, ReactNode } from 'react';

import {
  ActionsWrapper,
  BottomBarWrapper,
  Outer,
  StyledTitle,
  TitleContainer,
  TitleWrapper,
} from './styled';

type Props = {
  /** Contents of the action bar to be rendered next to the page title. */
  actions?: ReactElement;
  /** Contents of the action bar to be rendered next to the page title. Typically a button group. */
  bottomBar?: ReactElement;
  /** Page breadcrumbs to be rendered above the title. */
  breadcrumbs?: ReactElement;
  /** Contents of the bottom bar to be rendered below the page title. Typically contains a search bar and/or filters. */
  children?: ReactNode;
  /** Content of the page title. The text wraps by default. */
  disableTitleStyles?: boolean;
  /** Returns the inner ref to the DOM element of the title. This is exposed so the focus can be set. */
  innerRef?: (element: HTMLElement) => void;
  /** Prevent the title from wrapping across lines. This should be avoided. */
  truncateTitle?: boolean;
};

const PageHeader = ({
  innerRef,
  breadcrumbs,
  actions,
  bottomBar,
  children,
  disableTitleStyles = false,
  truncateTitle = false,
}: Props) => {
  return (
    <Outer>
      {breadcrumbs}
      <TitleWrapper truncate={truncateTitle}>
        <TitleContainer truncate={truncateTitle}>
          {disableTitleStyles ? (
            children
          ) : (
            <StyledTitle
              innerRef={innerRef}
              tabIndex={-1}
              truncate={truncateTitle}
            >
              {children}
            </StyledTitle>
          )}
        </TitleContainer>
        {actions && <ActionsWrapper>{actions}</ActionsWrapper>}
      </TitleWrapper>
      {bottomBar && <BottomBarWrapper> {bottomBar} </BottomBarWrapper>}
    </Outer>
  );
};

export default PageHeader;
