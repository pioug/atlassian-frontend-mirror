import { type CardAppearance } from '@atlaskit/linking-common';

import { type CardProps, type SmartLinkSize } from '../../src';
import { type FlexibleUiOptions } from '../../src/view/FlexibleCard/types';

import { type BlockName } from './constants';

export type FlexibleTemplate = {
	blocks?: BlockTemplate[];
	cardProps?: Partial<CardProps>;
	ui?: FlexibleUiOptions;
};

export type BlockTemplate = {
	[key: string]: any;
	name: BlockName;
};

export type BlockBuilderProps = {
	onChange: (template: BlockTemplate) => void;
	size?: SmartLinkSize;
	template: BlockTemplate;
};

export type SelectOptions = { label: string; value: string };

export type TemplateDisplay = 'flexible' | CardAppearance;
