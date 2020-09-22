import React, { ReactNode } from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import { Checkbox } from '@atlaskit/checkbox';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';

import { Description, Header } from './common';
import { AllowContact, Role } from './NPS';
import { ButtonWrapper, Wrapper } from './styled/common';
import { Contact, RoleQuestion } from './styled/followup';

export const RoleDropdown = ({
  roles,
  placeholder,
  selected,
  onRoleSelect,
}: {
  roles: Array<Role>;
  selected: Role | null;
  placeholder: string;
  onRoleSelect: (role: Role) => void;
}) => {
  const trigger = selected ? selected : placeholder;
  return (
    <DropdownMenu trigger={trigger} triggerType="button">
      {roles.map(role => (
        <DropdownItem
          key={`nps-item-${role}`}
          isSelected={role === selected}
          onClick={() => {
            onRoleSelect(role);
          }}
        >
          {role}
        </DropdownItem>
      ))}
    </DropdownMenu>
  );
};

export interface FollowUpProps {
  messages: {
    title: ReactNode;
    description: ReactNode;
    optOut: ReactNode;
    roleQuestion: ReactNode;
    contactQuestion: string;
    send: ReactNode;
    rolePlaceholder: string;
  };
  canClose: boolean;
  canOptOut: boolean;
  onClose: () => void;
  onOptOut: () => void;
  roles: Array<Role>;
  onRoleSelect: (role: Role) => void;
  onAllowContactChange: (allowContact: AllowContact) => void;
  onSubmit: ({
    role,
    allowContact,
  }: {
    role: Role | null;
    allowContact: AllowContact;
  }) => void;
}

interface State {
  role: Role | null;
  allowContact: AllowContact;
}

export default class Followup extends React.Component<FollowUpProps, State> {
  constructor(props: FollowUpProps) {
    super(props);
    this.state = {
      role: null,
      allowContact: false,
    };
  }

  static defaultProps = {
    onRoleSelect: () => {},
    onAllowContactChange: () => {},
  };

  onRoleSelect = (role: Role) => {
    this.setState({ role });
    this.props.onRoleSelect(role);
  };

  onAllowContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: to fix the type for e.isChecked.
    // @ts-ignore
    const allowContact = e.isChecked;
    this.setState({ allowContact });
    this.props.onAllowContactChange(allowContact);
  };

  onSubmit = () => {
    const { role, allowContact } = this.state;
    this.props.onSubmit({ role, allowContact });
  };

  render() {
    const {
      messages,
      canClose,
      onClose,
      canOptOut,
      onOptOut,
      roles,
    } = this.props;
    return (
      <div>
        <Header
          title={messages.title}
          canClose={canClose}
          onClose={onClose}
          canOptOut={canOptOut}
          onOptOut={onOptOut}
          optOutLabel={messages.optOut}
        />
        <Description>{messages.description}</Description>
        <Wrapper>
          <RoleQuestion>{this.props.messages.roleQuestion}</RoleQuestion>
          <RoleDropdown
            roles={roles}
            onRoleSelect={this.onRoleSelect}
            selected={this.state.role}
            placeholder={messages.rolePlaceholder}
          />
          <Contact>
            <Checkbox
              name="nps-contact-me"
              value="Allow Contact"
              label={messages.contactQuestion}
              onChange={this.onAllowContactChange}
            />
          </Contact>
        </Wrapper>
        <Wrapper>
          <ButtonWrapper>
            <Button appearance="primary" onClick={this.onSubmit}>
              {messages.send}
            </Button>
          </ButtonWrapper>
        </Wrapper>
      </div>
    );
  }
}
