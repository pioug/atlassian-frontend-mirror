import { CardAppearance } from '@atlaskit/linking-common';
import { FlexibleUiOptions } from '../../src/view/FlexibleCard/types';
import { BlockName } from './constants';
import { CardProps, SmartLinkSize } from '../../src';

export type FlexibleTemplate = {
  cardProps?: Partial<CardProps>;
  blocks?: BlockTemplate[];
  ui?: FlexibleUiOptions;
};

export type BlockTemplate = {
  name: BlockName;
  [key: string]: any;
};

export type BlockBuilderProps = {
  onChange: (template: BlockTemplate) => void;
  size?: SmartLinkSize;
  template: BlockTemplate;
};

export type SelectOptions = { label: string; value: string };

export type TemplateDisplay = 'flexible' | CardAppearance;
