/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { FieldBaseStateless } from '@atlaskit/field-base';
import TagGroup from '@atlaskit/tag-group';
import Tag from '@atlaskit/tag';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import Spinner from '@atlaskit/spinner';

import { Content, Expand, Input, TriggerDiv } from '../styled/Trigger';
import { mapAppearanceToFieldBase } from '../internal/appearances';

// =============================================================
// NOTE: Duplicated in ./internal/appearances until docgen can follow imports.
// -------------------------------------------------------------
// DO NOT update values here without updating the other.
// =============================================================

export default class Trigger extends PureComponent {
  static defaultProps = {
    isDisabled: false,
    isLoading: false,
    onClick: () => {},
    icon: <ExpandIcon label="" />,
  };

  // disabled because all of the accessibility is handled manually
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  render() {
    const {
      appearance,
      filterValue,
      handleItemRemove,
      handleOnChange,
      handleTriggerClick,
      inputRefFunction,
      icon,
      isDisabled,
      isFocused,
      isInvalid,
      invalidMessage,
      isLoading,
      isRequired,
      onBlur,
      onFocus,
      placeholder,
      selectedItems,
      tagGroupRefFunction,
    } = this.props;

    return (
      <FieldBaseStateless
        appearance={mapAppearanceToFieldBase(appearance)}
        isDisabled={isDisabled}
        isFitContainerWidthEnabled
        isDialogOpen={isFocused}
        isFocused={isFocused}
        isInvalid={isInvalid}
        invalidMessage={invalidMessage}
        isPaddingDisabled
        isRequired={isRequired}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        <TriggerDiv isDisabled={isDisabled} onClick={handleTriggerClick}>
          <Content>
            <TagGroup ref={tagGroupRefFunction}>
              {selectedItems.map((item) => (
                <Tag
                  appearance={item.tag ? item.tag.appearance : undefined}
                  elemBefore={item.tag ? item.tag.elemBefore : undefined}
                  key={item.value}
                  onAfterRemoveAction={() => {
                    handleItemRemove(item);
                  }}
                  removeButtonText={
                    isDisabled ? undefined : `${item.content}, remove`
                  }
                  text={item.content}
                />
              ))}
              {isDisabled ? null : (
                <Input
                  disabled={isDisabled}
                  onChange={handleOnChange}
                  placeholder={placeholder}
                  innerRef={inputRefFunction}
                  type="text"
                  value={filterValue}
                />
              )}
            </TagGroup>
          </Content>
          <Expand>{isFocused && isLoading ? <Spinner /> : icon}</Expand>
        </TriggerDiv>
      </FieldBaseStateless>
    );
  }
  /* eslint-enable jsx-a11y/no-static-element-interactions */
}
