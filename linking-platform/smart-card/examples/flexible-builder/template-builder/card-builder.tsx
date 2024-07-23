/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { useMemo } from 'react';
import CheckboxOption from './inputs/checkbox-option';
import { type CardProps } from '@atlaskit/smart-card';
import SelectOption from './inputs/select-option';
import TextOption from './inputs/text-option';
import { type TemplateDisplay } from '../types';
import Fieldset from './fieldset';

const appearanceOptions = [
	{ label: 'inline', value: 'inline' },
	{ label: 'block', value: 'block' },
	{ label: 'embed', value: 'embed' },
];
const platformOptions = [
	{ label: 'none (default)', value: '' },
	{ label: 'web', value: 'web' },
	{ label: 'mobile', value: 'mobile' },
];
const frameOptions = [
	{ label: 'none (default)', value: '' },
	{ label: 'show', value: 'show' },
	{ label: 'hide', value: 'hide' },
	{ label: 'showOnHover', value: 'showOnHover' },
];

const CardBuilder = ({
	display,
	onChange,
	template = {},
}: {
	display?: TemplateDisplay;
	onChange: (template: Partial<CardProps>) => void;
	template?: Partial<CardProps>;
}) => {
	const isInline = useMemo(() => display === 'inline', [display]);
	const isBlock = useMemo(() => display === 'block', [display]);
	const isEmbed = useMemo(() => display === 'embed', [display]);
	const isFlexible = useMemo(() => display === 'flexible', [display]);
	return (
		<Fieldset legend="Smart Links Options" defaultOpen={false}>
			<SelectOption
				defaultValue=""
				exclude={isFlexible}
				label="Appearance *"
				name="appearance"
				onChange={onChange}
				propName="appearance"
				options={appearanceOptions}
				template={template}
			/>
			<CheckboxOption
				exclude={!(isInline || isFlexible)}
				label="Show auth tooltip (inline, flexible)"
				name="showAuthTooltip"
				onChange={onChange}
				propName="showAuthTooltip"
				template={template}
			/>
			<CheckboxOption
				exclude={!(isInline || isFlexible)}
				label="Show hover preview (inline, flexible)"
				name="showHoverPreview"
				onChange={onChange}
				propName="showHoverPreview"
				template={template}
			/>
			<CheckboxOption
				defaultValue={true}
				exclude={!isBlock}
				label="Show actions (block)"
				name="showActions"
				onChange={onChange}
				propName="showActions"
				template={template}
			/>
			<CheckboxOption
				defaultValue={false}
				exclude={!isFlexible}
				label="Show server actions (inline, block, flexible)"
				name="showServerActions"
				onChange={onChange}
				propName="showServerActions"
				template={template}
			/>
			<CheckboxOption
				exclude={isFlexible}
				label="Selected"
				name="isSelected"
				onChange={onChange}
				propName="isSelected"
				template={template}
			/>
			<SelectOption
				defaultValue=""
				exclude={!isEmbed}
				label="Platform (embed)"
				name="platform"
				onChange={onChange}
				propName="platform"
				options={platformOptions}
				template={template}
			/>
			<SelectOption
				defaultValue=""
				exclude={!isEmbed}
				label="Frame style (embed)"
				name="frameStyle"
				onChange={onChange}
				propName="frameStyle"
				options={frameOptions}
				template={template}
			/>
			<TextOption
				defaultValue={template.placeholder || ''}
				label="Placeholder text"
				name="placeholder"
				onChange={onChange}
				propName="placeholder"
				template={template}
			/>
		</Fieldset>
	);
};

export default CardBuilder;
