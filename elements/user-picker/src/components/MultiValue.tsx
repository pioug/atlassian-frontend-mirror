import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { AddOptionAvatar } from './AddOptionAvatar';
import { SizeableAvatar } from './SizeableAvatar';
import { messages } from './i18n';
import { getAvatarUrl, isEmail, isGroup } from './utils';
import { Option, UserPickerProps } from '../types';

import Tag from '@atlaskit/tag';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import { B100 } from '@atlaskit/theme/colors';

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

const TagContainer = styled.div`
  button {
    &:focus {
      box-shadow: 0 0 0 2px ${B100};
    }
  }
  position: relative;
  right: 6px;
`;

const GroupTagContainer = styled.div`
  padding-left: 2px;
`;

type Props = {
  isFocused?: boolean;
  data: Option;
  innerProps: any;
  removeProps: { onClick: Function };
  selectProps: UserPickerProps;
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
        <AddOptionAvatar size="small" label={selectProps.emailLabel} />
      ) : (
        <FormattedMessage {...messages.addEmail}>
          {label => <AddOptionAvatar size="small" label={label as string} />}
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
    const {
      data: { label, data },
      innerProps,
      removeProps: { onClick: onRemove },
      isFocused,
      selectProps: { isDisabled },
    } = this.props;

    return (
      <div ref={this.containerRef}>
        <FormattedMessage {...messages.remove}>
          {remove => (
            <TagContainer>
              <Tag
                {...innerProps}
                appearance="rounded"
                text={label}
                elemBefore={this.getElemBefore()}
                removeButtonText={data.fixed || isDisabled ? undefined : remove}
                onAfterRemoveAction={onRemove}
                color={isFocused ? 'blueLight' : undefined}
              />
            </TagContainer>
          )}
        </FormattedMessage>
      </div>
    );
  }
}
