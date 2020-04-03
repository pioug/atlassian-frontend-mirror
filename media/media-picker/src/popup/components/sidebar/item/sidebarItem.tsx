import React from 'react';
import { Component, ReactNode } from 'react';
import { connect, Dispatch } from 'react-redux';
import { changeService } from '../../../actions/changeService';
import { ServiceName as ServiceNameDomain } from '../../../domain';
import { Wrapper, ServiceIcon, ServiceName } from './styled';

export interface SidebarItemOwnProps {
  readonly serviceName: ServiceNameDomain;
  readonly serviceFullName: ReactNode;
  readonly isActive: boolean;
}

export interface SidebarItemDispatchProps {
  readonly onChangeService: (serviceName: ServiceNameDomain) => void;
}

export type SidebarItemProps = SidebarItemOwnProps & SidebarItemDispatchProps;

export class StatelessSidebarItem extends Component<SidebarItemProps> {
  render() {
    const { serviceFullName, serviceName, isActive, children } = this.props;

    return (
      <Wrapper
        data-testid={`media-picker-${serviceName}-menu-item`}
        isActive={isActive}
        onClick={this.onClick}
      >
        <ServiceIcon>{children}</ServiceIcon>
        <ServiceName>{serviceFullName}</ServiceName>
      </Wrapper>
    );
  }

  private onClick = () => this.props.onChangeService(this.props.serviceName);
}

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
): SidebarItemDispatchProps => ({
  onChangeService: (serviceName: ServiceNameDomain) =>
    dispatch(changeService(serviceName)),
});

export default connect<
  undefined,
  SidebarItemDispatchProps,
  SidebarItemOwnProps
>(
  null,
  mapDispatchToProps,
)(StatelessSidebarItem);
