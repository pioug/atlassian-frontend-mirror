import React, { useState } from 'react';
import Textfield from '@atlaskit/textfield';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import {
  getMediaFeatureFlags,
  clearAllLocalFeatureFlags,
  setLocalFeatureFlag,
} from './helpers';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import styled from 'styled-components';

import Popup from '@atlaskit/popup';
import { Checkbox } from '@atlaskit/checkbox';
import debounce from 'lodash/debounce';

const camelCaseToSentenceCase = (text: string) => {
  var result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px auto;
`;

const ItemWrapper: React.FC = ({ children }) => (
  <div style={{ padding: '10px 20px' }}>{children}</div>
);

const CheckboxItem: React.FC<{
  name: keyof MediaFeatureFlags;
  initialValue: boolean;
  onChange: () => void;
}> = ({ name, initialValue, onChange }) => (
  <ItemWrapper>
    <Checkbox
      defaultChecked={initialValue}
      label={camelCaseToSentenceCase(name)}
      onChange={() => {
        const value = !initialValue;
        setLocalFeatureFlag(name, value);
        onChange();
      }}
      name={`media-feature-flag-check-${name}`}
    />
  </ItemWrapper>
);

const TextFieldItem: React.FC<{
  name: keyof MediaFeatureFlags;
  value: string;
  onChange: () => void;
  isNumber?: boolean;
}> = ({ name, value, isNumber, onChange }) => {
  const fieldChanged = debounce((newValue: string) => {
    const formattedValue = isNumber
      ? isNaN(Number(newValue))
        ? 0
        : Number(newValue)
      : newValue;
    setLocalFeatureFlag(name, formattedValue);
    onChange();
  }, 500);

  return (
    <ItemWrapper>
      <label htmlFor={`media-feature-flag-text-${name}`}>
        {camelCaseToSentenceCase(name)}:
      </label>
      <Textfield
        name={`media-feature-flag-text-${name}`}
        defaultValue={value}
        onChange={(e) => fieldChanged(e.currentTarget.value)}
        type={isNumber ? 'number' : 'text'}
      />
    </ItemWrapper>
  );
};

const FeatureFlagItems: React.FC<{
  onUpdate: () => void;
  filterFlags?: Array<keyof MediaFeatureFlags>;
}> = ({ onUpdate, filterFlags }) => {
  const flagItems = Object.entries(getMediaFeatureFlags(filterFlags));

  return (
    <div style={{ maxHeight: '200px', padding: '10px 0' }}>
      {flagItems.length > 0 ? (
        flagItems.map(([key, currentValue]) => {
          const name = key as keyof MediaFeatureFlags;
          const ffType = typeof currentValue;
          const isNumber = ffType === 'number';
          switch (ffType) {
            case 'boolean':
              return (
                <CheckboxItem
                  key={`media-feature-flag-item-${name}`}
                  name={name}
                  initialValue={currentValue}
                  onChange={onUpdate}
                />
              );
            case 'number':
            case 'string':
              return (
                <TextFieldItem
                  key={`media-feature-flag-item-${name}`}
                  name={name}
                  value={currentValue}
                  onChange={onUpdate}
                  isNumber={isNumber}
                />
              );
          }
        })
      ) : (
        <ItemWrapper>No flags available</ItemWrapper>
      )}
    </div>
  );
};

export type MediaFeatureFlagsDropdownProps = {
  onFlagChanged: () => void;
  filterFlags?: Array<keyof MediaFeatureFlags>;
};

const MediaFeatureFlagsDropdown = ({
  onFlagChanged,
  filterFlags,
}: MediaFeatureFlagsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Container>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom-start"
        content={() => (
          <FeatureFlagItems
            onUpdate={onFlagChanged}
            filterFlags={filterFlags}
          />
        )}
        trigger={(triggerProps) => (
          <Button
            {...triggerProps}
            isSelected={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            iconAfter={
              <HipchatChevronDownIcon label="Star icon" size="small" />
            }
          >
            Media Feature Flags
          </Button>
        )}
      />
      <Tooltip content="Reset all flags">
        <Button
          style={{ marginLeft: 10 }}
          iconBefore={<SelectClearIcon label="Star icon" size="small" />}
          onClick={() => {
            clearAllLocalFeatureFlags();
            onFlagChanged();
          }}
        ></Button>
      </Tooltip>
    </Container>
  );
};

export default MediaFeatureFlagsDropdown;
