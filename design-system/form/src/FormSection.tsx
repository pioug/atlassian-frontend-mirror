import React, { Component, ReactNode } from 'react';
import FormSectionWrapper, {
  FormSectionTitle,
  FormSectionDescription,
} from './styled/FormSection';

interface Props {
  /** Section Title */
  title?: ReactNode;
  /** Content or child components to be rendered after description */
  children?: ReactNode;
  /** Sub title or description of this section */
  description?: ReactNode;
}

export default class FormSection extends Component<Props> {
  render() {
    const { title, description, children } = this.props;

    return (
      <FormSectionWrapper>
        {title && <FormSectionTitle>{title}</FormSectionTitle>}
        {description && (
          <FormSectionDescription>{description}</FormSectionDescription>
        )}
        {children}
      </FormSectionWrapper>
    );
  }
}
