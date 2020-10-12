import React, { PureComponent, ReactNode } from 'react';

import AnimateHeight from 'react-animate-height';

import Button from '@atlaskit/button/custom-theme-button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import * as styles from './styledPanel';

export type BasePanelProps = {
  /** Content to be shown inside the panel. */
  children?: ReactNode;
  /** Header to render on the panel. Clicking the header expands and collapses the panel */
  header?: ReactNode;
};

export type Props = BasePanelProps & {
  /** Defines whether the panel is expanded by default. */
  isExpanded: boolean;
  /** This callback is called when panel is expanded/collapsed */
  onChange: (isExpanded: boolean) => void;
};

export default class PanelStateless extends PureComponent<Props> {
  static defaultProps = {
    isExpanded: false,
  };

  render() {
    const { children, header, isExpanded, onChange } = this.props;

    return (
      <styles.PanelWrapper>
        <styles.PanelHeader onClick={() => onChange(!isExpanded)}>
          <styles.ButtonWrapper isHidden={isExpanded}>
            <Button
              appearance="subtle"
              aria-expanded={isExpanded}
              spacing="none"
              iconBefore={
                isExpanded ? (
                  <ChevronDownIcon label="collapse" />
                ) : (
                  <ChevronRightIcon label="expand" />
                )
              }
            />
          </styles.ButtonWrapper>
          <span>{header}</span>
        </styles.PanelHeader>

        <AnimateHeight
          duration={200}
          easing="linear"
          height={isExpanded ? 'auto' : 0}
        >
          {children}
        </AnimateHeight>
      </styles.PanelWrapper>
    );
  }
}
