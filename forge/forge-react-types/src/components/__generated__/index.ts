export type { BadgeProps, TBadge } from './BadgeProps.codegen';
export type { BoxProps, TBox } from './BoxProps.codegen';
export type { ButtonGroupProps, TButtonGroup } from './ButtonGroupProps.codegen';
export type { ButtonProps, TButton } from './ButtonProps.codegen';
export type { CheckboxProps, TCheckbox } from './CheckboxProps.codegen';
export type { CalendarProps, TCalendar } from './CalendarProps.codegen';
export type { CheckboxGroupProps, TCheckboxGroup } from './CheckboxGroupProps.codegen';
export type { CodeBlockProps, TCodeBlock } from './CodeBlockProps.codegen';
export type { CodeProps, TCode } from './CodeProps.codegen';
export type { CommentProps, TComment } from './CommentProps.codegen';
export type { DatePickerProps, TDatePicker } from './DatePickerProps.codegen';
export type { DynamicTableProps, TDynamicTable } from './DynamicTableProps.codegen';
export type { EmptyStateProps, TEmptyState } from './EmptyStateProps.codegen';
export type { ErrorMessageProps, TErrorMessage } from './ErrorMessageProps.codegen';
export type { FileCardProps, TFileCard } from './FileCardProps.codegen';
export type { FlexProps, TFlex } from './FlexProps.codegen';
export type { FormFooterProps, TFormFooter } from './FormFooterProps.codegen';
export type { FormHeaderProps, TFormHeader } from './FormHeaderProps.codegen';
export type { FormProps, TForm } from './FormProps.codegen';
export type { FormSectionProps, TFormSection } from './FormSectionProps.codegen';
export type { GridProps, TGrid } from './GridProps.codegen';
export type { HeadingProps, THeading } from './HeadingProps.codegen';
export type { HelperMessageProps, THelperMessage } from './HelperMessageProps.codegen';
export type { IconProps, TIcon } from './IconProps.codegen';
export type { InlineProps, TInline } from './InlineProps.codegen';
export type { InlineEditProps, TInlineEdit } from './InlineEditProps.codegen';
export type { LabelProps, TLabel } from './LabelProps.codegen';
export type { LinkButtonProps, TLinkButton } from './LinkButtonProps.codegen';
export type { ListProps, TList } from './ListProps.codegen';
export type { ListItemProps, TListItem } from './ListItemProps.codegen';
export type { LoadingButtonProps, TLoadingButton } from './LoadingButtonProps.codegen';
export type { LozengeProps, TLozenge } from './LozengeProps.codegen';
export type { ModalBodyProps, TModalBody } from './ModalBodyProps.codegen';
export type { ModalFooterProps, TModalFooter } from './ModalFooterProps.codegen';
export type { ModalHeaderProps, TModalHeader } from './ModalHeaderProps.codegen';
export type { ModalProps, TModal } from './ModalProps.codegen';
export type { ModalTitleProps, TModalTitle } from './ModalTitleProps.codegen';
export type { ModalTransitionProps, TModalTransition } from './ModalTransitionProps.codegen';
export type { ProgressBarProps, TProgressBar } from './ProgressBarProps.codegen';
export type { ProgressTrackerProps, TProgressTracker } from './ProgressTrackerProps.codegen';
export type { RadioGroupProps, TRadioGroup } from './RadioGroupProps.codegen';
export type { RadioProps, TRadio } from './RadioProps.codegen';
export type { RangeProps, TRange } from './RangeProps.codegen';
export type {
	SectionMessageActionProps,
	TSectionMessageAction,
} from './SectionMessageActionProps.codegen';
export type { SectionMessageProps, TSectionMessage } from './SectionMessageProps.codegen';
export type { SelectProps, TSelect } from './SelectProps.codegen';
export type { SpinnerProps, TSpinner } from './SpinnerProps.codegen';
export type { StackProps, TStack } from './StackProps.codegen';
export type { TabListProps, TTabList } from './TabListProps.codegen';
export type { TabPanelProps, TTabPanel } from './TabPanelProps.codegen';
export type { TabProps, TTab } from './TabProps.codegen';
export type { TabsProps, TTabs } from './TabsProps.codegen';
export type { TagGroupProps, TTagGroup } from './TagGroupProps.codegen';
export type { SimpleTagProps as TagProps, TSimpleTag as TTag } from './TagProps.codegen';
export type { TextAreaProps, TTextArea } from './TextAreaProps.codegen';
export type { TextfieldProps, TTextfield } from './TextfieldProps.codegen';
export type { TimePickerProps, TTimePicker } from './TimePickerProps.codegen';
export type { ToggleProps, TToggle } from './ToggleProps.codegen';
export type { TooltipProps, TTooltip } from './TooltipProps.codegen';
export type { ValidMessageProps, TValidMessage } from './ValidMessageProps.codegen';
export type { PopupProps, TPopup } from './PopupProps.codegen';
export type { AdfRendererProps, TAdfRenderer } from './AdfRendererProps.codegen';
export type { FilePickerProps, TFilePicker } from './FilePickerProps.codegen';

// Forge UI supports the value "strike" for the "as" prop of the Text component, to have a migration path
// off using <Strike>. The native ADS Text component does not support it, so we patched it to support it.
import type { TextProps as OriginalTextProps } from './TextProps.codegen';
export type TextProps = Omit<OriginalTextProps, 'as'> & { as?: OriginalTextProps['as'] | 'strike' };

/**
 * A typography component used to display body text.
 * It can also include inline components such as
 * [Badge](https://developer.atlassian.com/platform/forge/ui-kit/components/badge/) and
 * [Lozenge](https://developer.atlassian.com/platform/forge/ui-kit/components/lozenge/).
 */
export type TText<T> = (props: TextProps) => T;

export type { PressableProps, TPressable } from './PressableProps.codegen';
