import React from 'react';
import Tooltip, { PositionType } from '@atlaskit/tooltip';
import { ButtonProps } from '@atlaskit/button/types';
import Button from './styles';
import { MenuItem } from '../DropdownMenu/types';
import styled from 'styled-components';

export type Props = {
  className?: string;
  disabled?: boolean;
  hideTooltip?: boolean;
  href?: string;
  iconAfter?: React.ReactElement<any>;
  iconBefore?: React.ReactElement<any>;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onItemClick?: (item: MenuItem) => void;
  selected?: boolean;
  spacing?: 'default' | 'compact' | 'none';
  target?: string;
  title?: React.ReactNode;
  titlePosition?: PositionType;
  item?: MenuItem;
  testId?: string;
} & Pick<ButtonProps, 'aria-label'>;

const ButtonWrapper = styled.div`
  display: flex;
  height: 100%;
`;

export default class ToolbarButton extends React.PureComponent<Props, {}> {
  static defaultProps = {
    className: '',
    titlePosition: 'top' as PositionType,
  };

  private handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const { disabled, onClick, onItemClick, item } = this.props;

    if (!disabled && onClick) {
      onClick(event);
    }

    if (!disabled && item && onItemClick) {
      onItemClick(item);
    }
  };

  render() {
    const button = (
      <Button
        appearance="subtle"
        aria-haspopup
        testId={this.props.testId}
        className={this.props.className}
        href={this.props.href}
        aria-label={this.props['aria-label']}
        iconAfter={this.props.iconAfter}
        iconBefore={this.props.iconBefore}
        isDisabled={this.props.disabled}
        isSelected={this.props.selected}
        onClick={this.handleClick}
        spacing={this.props.spacing || 'default'}
        target={this.props.target}
        shouldFitContainer
      >
        {this.props.children}
      </Button>
    );

    const tooltipContent = !this.props.hideTooltip ? this.props.title : null;

    return this.props.title ? (
      <Tooltip
        content={tooltipContent}
        hideTooltipOnClick={true}
        position={this.props.titlePosition}
      >
        <ButtonWrapper>{button}</ButtonWrapper>
      </Tooltip>
    ) : (
      button
    );
  }
}
