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
  /** Returns the inner ref of the component. This is exposed so the focus can be set. */
  innerRef?: (element: HTMLElement) => void;
  /** Page breadcrumbs to be rendered above the title. */
  breadcrumbs?: ReactElement;
  /** Contents of the action bar to be rendered next to the page title. */
  actions?: ReactElement;
  /** Contents of the header bar to be rendered below the page title. */
  bottomBar?: ReactElement;
  /** Content of the page title. The text would be trimmed if it doesn't fit the
   header width and end with an ellipsis */
  children?: ReactNode;
  /** Disable default styles for page title */
  disableTitleStyles?: boolean;
  /** Prevent the title from wrapping across lines */
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
        <ActionsWrapper>{actions}</ActionsWrapper>
      </TitleWrapper>
      {bottomBar && <BottomBarWrapper> {bottomBar} </BottomBarWrapper>}
    </Outer>
  );
};

export default PageHeader;
