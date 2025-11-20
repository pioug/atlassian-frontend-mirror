import React, { useCallback, useMemo } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { CheckboxField, Field } from '@atlaskit/form';
import Select from '@atlaskit/select/Select';
import { type CardProps } from '@atlaskit/smart-card';

import { type CardActionOptions } from '../../../src/view/Card/types';
import { EmbedModalSize } from '../../../src/view/EmbedModal/types';
import { type TemplateDisplay } from '../types';

import Fieldset from './fieldset';
import CheckboxOption from './inputs/checkbox-option';
import Label from './inputs/label';
import SelectOption from './inputs/select-option';
import TextOption from './inputs/text-option';

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
const previewSizeOptions = Object.values(EmbedModalSize).map((name) => ({
	label: name,
	value: {
		previewAction: {
			size: name,
		},
	} as CardActionOptions,
}));

const CardBuilder = ({
	display,
	onChange,
	template = {},
}: {
	display?: TemplateDisplay;
	onChange: (template: Partial<CardProps>) => void;
	template?: Partial<CardProps>;
}): React.JSX.Element => {
	const isInline = useMemo(() => display === 'inline', [display]);
	const isEmbed = useMemo(() => display === 'embed', [display]);
	const isFlexible = useMemo(() => display === 'flexible', [display]);

	// Custom onChange handlers for actionOptions to properly merge previewAction properties
	const handlePreviewSizeChange = useCallback(
		(sizeOption: { label: string; value: CardActionOptions } | null) => {
			const newSize = sizeOption?.value?.previewAction?.size;
			const currentActionOptions = (template.actionOptions || {}) as CardActionOptions;
			const currentPreviewAction = currentActionOptions?.previewAction || {};

			if (newSize) {
				onChange({
					...template,
					actionOptions: {
						...currentActionOptions,
						hide: false,
						previewAction: {
							...currentPreviewAction,
							size: newSize,
						},
					},
				});
			} else {
				// Remove size but keep other previewAction properties
				const { size: removedSize, ...restPreviewAction } = currentPreviewAction;
				const hasOtherPreviewProps = Object.keys(restPreviewAction).length > 0;

				if (hasOtherPreviewProps) {
					onChange({
						...template,
						actionOptions: {
							...currentActionOptions,
							hide: false,
							previewAction: restPreviewAction,
						},
					});
				} else {
					// Remove entire previewAction if no other props exist
					const { previewAction: removedPreviewAction, ...restActionOptions } =
						currentActionOptions;
					const hasOtherActionOptions = Object.keys(restActionOptions).length > 0;

					if (hasOtherActionOptions) {
						onChange({
							...template,
							actionOptions: {
								...restActionOptions,
								hide: false,
							},
						});
					} else {
						// Remove entire actionOptions if no other props exist
						const { actionOptions: removedActionOptions, ...restTemplate } = template;
						onChange(restTemplate);
					}
				}
			}
		},
		[onChange, template],
	);

	const handleHideBlanketChange = useCallback(
		(checked: boolean) => {
			const currentActionOptions = (template.actionOptions || {}) as CardActionOptions;
			const currentPreviewAction = currentActionOptions?.previewAction || {};

			if (checked) {
				onChange({
					...template,
					actionOptions: {
						...currentActionOptions,
						hide: false,
						previewAction: {
							...currentPreviewAction,
							hideBlanket: true,
						},
					},
				});
			} else {
				// Remove hideBlanket but keep other previewAction properties
				const { hideBlanket: removedHideBlanket, ...restPreviewAction } = currentPreviewAction;
				const hasOtherPreviewProps = Object.keys(restPreviewAction).length > 0;

				if (hasOtherPreviewProps) {
					onChange({
						...template,
						actionOptions: {
							...currentActionOptions,
							hide: false,
							previewAction: restPreviewAction,
						},
					});
				} else {
					// Remove entire previewAction if no other props exist
					const { previewAction: removedPreviewAction, ...restActionOptions } =
						currentActionOptions;
					const hasOtherActionOptions = Object.keys(restActionOptions).length > 0;

					if (hasOtherActionOptions) {
						onChange({
							...template,
							actionOptions: {
								...restActionOptions,
								hide: false,
							},
						});
					} else {
						// Remove entire actionOptions if no other props exist
						const { actionOptions: removedActionOptions, ...restTemplate } = template;
						onChange(restTemplate);
					}
				}
			}
		},
		[onChange, template],
	);

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
				label="Show hover preview (inline, flexible)"
				name="showHoverPreview"
				onChange={onChange}
				propName="showHoverPreview"
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
			<Field<{ label: string; value: string }>
				name="previewSize"
				// eslint-disable-next-line @atlassian/a11y/label-has-associated-control -- See https://go/a11y-label-has-associated-control for more details
				label={<Label content="Preview size (preview action)" />}
			>
				{({ fieldProps: { id, ...rest } }) => (
					<Select
						{...rest}
						onChange={(option: { label: string; value: string } | null) => {
							const selectedOption = previewSizeOptions.find(
								(opt) => opt.value.previewAction?.size === option?.value,
							);
							handlePreviewSizeChange(selectedOption || null);
						}}
						options={previewSizeOptions.map((opt) => ({
							label: opt.label,
							value: opt.value.previewAction?.size || '',
						}))}
						value={previewSizeOptions
							.map((opt) => ({ label: opt.label, value: opt.value.previewAction?.size || '' }))
							.find((opt) => opt.value === (template.actionOptions?.previewAction?.size || ''))}
					/>
				)}
			</Field>
			<CheckboxField name="hideBlanket">
				{({ fieldProps }) => (
					<Checkbox
						{...fieldProps}
						isChecked={template.actionOptions?.previewAction?.hideBlanket || false}
						// eslint-disable-next-line @atlassian/a11y/label-has-associated-control -- See https://go/a11y-label-has-associated-control for more details
						label={<Label content="Hide blanket (preview action)" />}
						onChange={(e: React.SyntheticEvent<HTMLInputElement>) => {
							handleHideBlanketChange(e.currentTarget.checked);
						}}
					/>
				)}
			</CheckboxField>
		</Fieldset>
	);
};

export default CardBuilder;
