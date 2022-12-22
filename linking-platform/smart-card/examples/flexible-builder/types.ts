import { FlexibleUiOptions } from '../../src/view/FlexibleCard/types';
import { BlockName } from './constants';
import { SmartLinkSize } from '../../src';

export type FlexibleTemplate = {
  blocks: BlockTemplate[];
  ui?: FlexibleUiOptions;
  cardProps?: CardBuilderProps;
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

export type CardBuilderProps = {
  showHoverPreview?: boolean;
};

export type SelectOptions = { label: string; value: string };
