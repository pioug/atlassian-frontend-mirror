import React from 'react';
import { FormattedMessage } from 'react-intl';
import { components, OptionType } from '@atlaskit/select';
import styled from 'styled-components';
import { AddOptionAvatar } from './AddOptionAvatar';
import { SizeableAvatar } from './SizeableAvatar';
import { messages } from './i18n';
import { getAvatarUrl, isEmail, isGroup } from './utils';
import { Option, UserPickerProps } from '../types';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import { MultiValueProps } from '@atlaskit/select/types';

export const scrollToValue = (
  valueContainer: HTMLDivElement,
  control: HTMLElement,
) => {
  const { top, height } = valueContainer.getBoundingClientRect();
  const { height: controlHeight } = control.getBoundingClientRect();

  if (top - height < 0) {
    valueContainer.scrollIntoView();
  }

  if (top + height > controlHeight) {
    valueContainer.scrollIntoView(false);
  }
};

const GroupTagContainer = styled.div`
  padding-left: 2px;
`;

const NameWrapper = styled.span`
  padding-left: 5px;
`;

type Props = MultiValueProps<OptionType> & {
  isFocused?: boolean;
  data: Option;
  innerProps: any;
  removeProps: { onClick: Function };
  selectProps: UserPickerProps;
  ref?: React.RefObject<HTMLDivElement>;
};

export class MultiValue extends React.Component<Props> {
  private containerRef: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props);
    this.containerRef = React.createRef<HTMLDivElement>();
  }

  componentDidUpdate() {
    const { isFocused } = this.props;
    if (
      isFocused &&
      this.containerRef.current &&
      this.containerRef.current.parentElement &&
      this.containerRef.current.parentElement.parentElement
    ) {
      scrollToValue(
        this.containerRef.current,
        this.containerRef.current.parentElement.parentElement,
      );
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    const {
      data: { label, data },
      innerProps,
      isFocused,
    } = this.props;

    const {
      data: { label: nextLabel, data: nextData },
      innerProps: nextInnerProps,
      isFocused: nextIsFocused,
    } = nextProps;

    // We can ignore onRemove here because it is a anonymous function
    // that will recreated every time but with the same implementation.
    return (
      data !== nextData ||
      label !== nextLabel ||
      innerProps !== nextInnerProps ||
      isFocused !== nextIsFocused
    );
  }

  getElemBefore = () => {
    const {
      data: { data, label },
      selectProps,
    } = this.props;
    if (isEmail(data)) {
      return selectProps.emailLabel ? (
        <AddOptionAvatar isLozenge label={selectProps.emailLabel} />
      ) : (
        <FormattedMessage {...messages.addEmail}>
          {(label) => <AddOptionAvatar isLozenge label={label as string} />}
        </FormattedMessage>
      );
    }

    if (isGroup(data)) {
      return (
        <GroupTagContainer>
          <PeopleIcon label="group-icon" size="small" />
        </GroupTagContainer>
      );
    }

    return (
      <SizeableAvatar
        appearance="multi"
        src={getAvatarUrl(data)}
        name={label}
      />
    );
  };

  render() {
    const { children, innerProps, ...rest } = this.props;

    return (
      <components.MultiValue
        {...rest}
        innerProps={{ ref: this.containerRef }}
        cropWithEllipsis={false}
      >
        {this.getElemBefore()} <NameWrapper>{children}</NameWrapper>
      </components.MultiValue>
    );
  }
}
