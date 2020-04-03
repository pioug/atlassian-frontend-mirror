import React from 'react';
import Button from '../styled/Button';
import ItemWrapper from '../styled/BreadcrumbsItem';
import Separator from '../styled/Separator';

interface IProps {
  hasSeparator?: boolean;
  onClick?: (event: React.MouseEvent) => any;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}

export default class EllipsisItem extends React.Component<IProps, {}> {
  static defaultProps: IProps = {
    hasSeparator: false,
    onClick: () => {},
  };

  render() {
    const { testId } = this.props;
    return (
      <ItemWrapper>
        <Button
          appearance="subtle-link"
          spacing="none"
          testId={testId}
          onClick={this.props.onClick}
        >
          &hellip;
        </Button>
        {this.props.hasSeparator ? <Separator>/</Separator> : null}
      </ItemWrapper>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */
