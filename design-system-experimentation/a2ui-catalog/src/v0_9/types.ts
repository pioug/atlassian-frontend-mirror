/** Public TypeScript types for the v0.9 ADS catalog (inferred from schemas). */

import type { z } from 'zod';

import type {
	ButtonSchema,
	CardBodySchema,
	CardContentSchema,
	CardDescriptionSchema,
	CardFooterSchema,
	CardHeaderSchema,
	CardLeadingSchema,
	CardMediaSchema,
	CardPrimaryContentSchema,
	CardSchema,
	CardTitleSchema,
	CheckBoxSchema,
	CodeDiffSchema,
	ColumnSchema,
	FieldSchema,
	FormFooterSchema,
	FormHeaderSchema,
	FormSchema,
	FormSectionSchema,
	MultipleChoiceSchema,
	RowSchema,
	TextFieldSchema,
	TextSchema,
} from './schemas';

export type A2UIv09ButtonProps = z.infer<typeof ButtonSchema>;
export type A2UIv09TextProps = z.infer<typeof TextSchema>;
export type A2UIv09RowProps = z.infer<typeof RowSchema>;
export type A2UIv09ColumnProps = z.infer<typeof ColumnSchema>;
/** Wire shape — bindable fields are not yet resolved. */
export type A2UIv09CheckBoxProps = z.infer<typeof CheckBoxSchema>;
export type A2UIv09CardProps = z.infer<typeof CardSchema>;
export type A2UIv09CardMediaProps = z.infer<typeof CardMediaSchema>;
export type A2UIv09CardContentProps = z.infer<typeof CardContentSchema>;
export type A2UIv09CardLeadingProps = z.infer<typeof CardLeadingSchema>;
export type A2UIv09CardPrimaryContentProps = z.infer<typeof CardPrimaryContentSchema>;
export type A2UIv09CardHeaderProps = z.infer<typeof CardHeaderSchema>;
export type A2UIv09CardTitleProps = z.infer<typeof CardTitleSchema>;
export type A2UIv09CardDescriptionProps = z.infer<typeof CardDescriptionSchema>;
export type A2UIv09CardBodyProps = z.infer<typeof CardBodySchema>;
export type A2UIv09CardFooterProps = z.infer<typeof CardFooterSchema>;
/** Wire shape — bindable fields are not yet resolved. */
export type A2UIv09TextFieldProps = z.infer<typeof TextFieldSchema>;
/** Wire shape — bindable fields are not yet resolved. */
export type A2UIv09MultipleChoiceProps = z.infer<typeof MultipleChoiceSchema>;
export type A2UIv09FormProps = z.infer<typeof FormSchema>;
/** Wire shape — bindable fields are not yet resolved. */
export type A2UIv09FieldProps = z.infer<typeof FieldSchema>;
/** Wire shape — bindable fields are not yet resolved. */
export type A2UIv09FormSectionProps = z.infer<typeof FormSectionSchema>;
/** Wire shape — bindable fields are not yet resolved. */
export type A2UIv09FormHeaderProps = z.infer<typeof FormHeaderSchema>;
export type A2UIv09FormFooterProps = z.infer<typeof FormFooterSchema>;
export type A2UIv09CodeDiffProps = z.infer<typeof CodeDiffSchema>;

/** Discriminated union of all v0.9 component instances. */
export type A2UIv09ComponentInstance =
	| { id: string; component: { Button: A2UIv09ButtonProps } }
	| { id: string; component: { Text: A2UIv09TextProps } }
	| { id: string; component: { Row: A2UIv09RowProps } }
	| { id: string; component: { Column: A2UIv09ColumnProps } }
	| { id: string; component: { CheckBox: A2UIv09CheckBoxProps } }
	| { id: string; component: { Card: A2UIv09CardProps } }
	| { id: string; component: { CardMedia: A2UIv09CardMediaProps } }
	| { id: string; component: { CardContent: A2UIv09CardContentProps } }
	| { id: string; component: { CardLeading: A2UIv09CardLeadingProps } }
	| { id: string; component: { CardPrimaryContent: A2UIv09CardPrimaryContentProps } }
	| { id: string; component: { CardHeader: A2UIv09CardHeaderProps } }
	| { id: string; component: { CardTitle: A2UIv09CardTitleProps } }
	| { id: string; component: { CardDescription: A2UIv09CardDescriptionProps } }
	| { id: string; component: { CardBody: A2UIv09CardBodyProps } }
	| { id: string; component: { CardFooter: A2UIv09CardFooterProps } }
	| { id: string; component: { TextField: A2UIv09TextFieldProps } }
	| { id: string; component: { MultipleChoice: A2UIv09MultipleChoiceProps } }
	| { id: string; component: { Form: A2UIv09FormProps } }
	| { id: string; component: { Field: A2UIv09FieldProps } }
	| { id: string; component: { FormSection: A2UIv09FormSectionProps } }
	| { id: string; component: { FormHeader: A2UIv09FormHeaderProps } }
	| { id: string; component: { FormFooter: A2UIv09FormFooterProps } }
	| { id: string; component: { CodeDiff: A2UIv09CodeDiffProps } };

export type A2UIv09ComponentName =
	| 'Button'
	| 'Text'
	| 'Row'
	| 'Column'
	| 'CheckBox'
	| 'Card'
	| 'CardMedia'
	| 'CardContent'
	| 'CardLeading'
	| 'CardPrimaryContent'
	| 'CardHeader'
	| 'CardTitle'
	| 'CardDescription'
	| 'CardBody'
	| 'CardFooter'
	| 'TextField'
	| 'MultipleChoice'
	| 'Form'
	| 'Field'
	| 'FormSection'
	| 'FormHeader'
	| 'FormFooter'
	| 'CodeDiff';
