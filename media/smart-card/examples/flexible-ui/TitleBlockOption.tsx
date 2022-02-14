/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/core';
import { RadioGroup } from '@atlaskit/radio';
import {
  ActionItem,
  ElementItem,
  SmartLinkDirection,
  SmartLinkPosition,
} from '../../src';
import {
  directionOptions,
  handleOnChange,
  positionOptions,
  renderActionGroupOptions,
  renderElementGroupOptions,
} from './utils';

const expandStyles = css`
  flex: 1;
`;

const optionStyles = css`
  display: flex;
`;

type TitleBlockOptionProps = {
  metadata: ElementItem[];
  subtitle: ElementItem[];
  actions: ActionItem[];
  setDirection: React.Dispatch<React.SetStateAction<SmartLinkDirection>>;
  setMaxLines: React.Dispatch<React.SetStateAction<number>>;
  setMetadata: React.Dispatch<React.SetStateAction<ElementItem[]>>;
  setPosition: React.Dispatch<React.SetStateAction<SmartLinkPosition>>;
  setSubTitle: React.Dispatch<React.SetStateAction<ElementItem[]>>;
  setAction: React.Dispatch<React.SetStateAction<ActionItem[]>>;
};

const TitleBlockOption: React.FC<TitleBlockOptionProps> = ({
  metadata,
  subtitle,
  actions,
  setDirection,
  setMaxLines,
  setMetadata,
  setPosition,
  setSubTitle,
  setAction,
}) => (
  <div css={expandStyles}>
    <h3>TitleBlock options</h3>
    <div css={optionStyles}>
      <div>
        <h6>Lines</h6>
        <RadioGroup
          defaultValue="2"
          options={[
            { name: 'maxLines', value: '1', label: 'Single' },
            { name: 'maxLines', value: '2', label: 'Double' },
          ]}
          onChange={(e) => setMaxLines(Number(e.currentTarget.value))}
        />
        <h6>Direction</h6>
        <RadioGroup
          defaultValue={SmartLinkDirection.Horizontal}
          options={directionOptions}
          onChange={handleOnChange(setDirection)}
        />
        <h6>Position</h6>
        <RadioGroup
          defaultValue={SmartLinkPosition.Top}
          options={positionOptions}
          onChange={handleOnChange(setPosition)}
        />
      </div>
      <div>
        <h6>Subtitle</h6>
        {renderElementGroupOptions(subtitle, setSubTitle)}
      </div>
      <div>
        <h6>Metadata</h6>
        {renderElementGroupOptions(metadata, setMetadata)}
      </div>
      <div>
        <h6>Actions</h6>
        {renderActionGroupOptions(actions, setAction)}
      </div>
    </div>
  </div>
);

export default TitleBlockOption;
