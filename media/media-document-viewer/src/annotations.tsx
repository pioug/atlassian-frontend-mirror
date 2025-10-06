/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';

import { type ComboBoxField, type PageAnnotations, type TextField } from './types';

const formInputBaseStyles = css({
	appearance: 'none',
	border: 'none',
	resize: 'none',
	padding: 0,
});

const textInputStyles = css({
	position: 'absolute',
	height: '100%',
	boxSizing: 'border-box',
	width: '100%',
});

const foreignObjectProps = {
	xmlns: 'http://www.w3.org/1999/xhtml',
};

type TextInputProps = {
	style: React.CSSProperties;
	value: string;
	as: 'input' | 'textarea';
};

const TextInput = ({ as: Component, value, style }: TextInputProps) => (
	<Component
		{...foreignObjectProps}
		css={[formInputBaseStyles, textInputStyles]}
		style={style}
		onKeyUp={(e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
			// stop propagation of the arrow key events because they can be used to navigate viewports
			if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
				e.stopPropagation();
			}
		}}
		value={value}
		type="text"
		readOnly
	/>
);

export const TextInputFormField = ({
	field,
	dataTestId,
}: {
	field: TextField;
	dataTestId?: string;
}) => {
	const style: React.CSSProperties = { ['fontSize']: `${field.f}px` };

	return (
		<foreignObject
			x={field.x}
			y={-field.y}
			width={field.w}
			height={field.h}
			data-testid={dataTestId}
		>
			<TextInput style={style} as={field.multiline ? 'textarea' : 'input'} value={field.text} />
		</foreignObject>
	);
};

const comboBoxStyles = css({
	display: 'grid',
	gridTemplateColumns: '1fr auto',
	alignItems: 'center',
	justifyContent: 'space-between',
	position: 'absolute',
	height: '100%',
	width: '100%',
});

const comboBoxInputStyles = css({
	width: '100%',
});

export const ComboBoxFormField = ({
	field,
	dataTestId,
}: {
	field: ComboBoxField;
	dataTestId?: string;
}) => {
	return (
		<foreignObject
			x={field.x}
			y={-field.y}
			width={field.w}
			height={field.h}
			data-testid={dataTestId}
		>
			<div {...foreignObjectProps} css={comboBoxStyles}>
				<input
					css={[formInputBaseStyles, comboBoxInputStyles]}
					style={{ ['fontSize']: `${field.f}px` }}
					type="text"
					value={field.text}
					// stop propagation of the arrow key events because they can be used to navigate viewports
					onKeyUp={(e) => {
						if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
							e.stopPropagation();
						}
					}}
					readOnly
				/>
				<ChevronDownIcon label="" size="small" />
			</div>
		</foreignObject>
	);
};

export const Annotations = ({ annotations }: { annotations: PageAnnotations }) => {
	return (
		<React.Fragment>
			{annotations.text_form_fields.map((field, i) => {
				return <TextInputFormField field={field} dataTestId={`text-form-field-${i}`} key={i} />;
			})}
			{annotations.combobox_form_fields.map((field, i) => {
				return <ComboBoxFormField field={field} dataTestId={`combobox-form-field-${i}`} key={i} />;
			})}
		</React.Fragment>
	);
};
