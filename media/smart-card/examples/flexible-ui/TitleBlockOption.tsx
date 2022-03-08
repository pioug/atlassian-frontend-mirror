/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';
import { RadioGroup } from '@atlaskit/radio';
import Textfield from '@atlaskit/textfield';
import {
  ActionItem,
  ElementItem,
  SmartLinkDirection,
  SmartLinkPosition,
} from '../../src';
import {
  blockOptionStyles,
  directionOptions,
  handleOnChange,
  positionOptions,
  RenderActionOptions,
  renderMetadataOptions,
} from './utils';

type TitleBlockOptionProps = {
  metadata: ElementItem[];
  subtitle: ElementItem[];
  text: string;
  setDirection: React.Dispatch<React.SetStateAction<SmartLinkDirection>>;
  setMaxLines: React.Dispatch<React.SetStateAction<number>>;
  setMetadata: React.Dispatch<React.SetStateAction<ElementItem[]>>;
  setPosition: React.Dispatch<React.SetStateAction<SmartLinkPosition>>;
  setSubTitle: React.Dispatch<React.SetStateAction<ElementItem[]>>;
  setActions: React.Dispatch<React.SetStateAction<ActionItem[]>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

const TitleBlockOption: React.FC<TitleBlockOptionProps> = ({
  metadata,
  subtitle,
  text,
  setDirection,
  setMaxLines,
  setMetadata,
  setPosition,
  setSubTitle,
  setActions,
  setText,
}) => (
  <React.Fragment>
    <h3>TitleBlock options</h3>
    <div css={blockOptionStyles}>
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
        <h6>Title Override</h6>
        <Textfield value={text} onChange={handleOnChange(setText)} />
        <h6>Metadata</h6>
        {renderMetadataOptions(metadata, setMetadata)}
        <h6>Subtitle</h6>
        {renderMetadataOptions(subtitle, setSubTitle)}
        <h6>Actions</h6>
        <RenderActionOptions setActionItems={setActions} />
      </div>
    </div>
  </React.Fragment>
);

export default TitleBlockOption;
