import React, { Component, ReactNode } from 'react';
import FormHeaderWrapper, {
  FormHeaderTitle,
  FormHeaderDescription,
  FormHeaderContent,
} from './styled/FormHeader';

interface Props {
  /** Header Title */
  title?: ReactNode;
  /** Header sub title or description */
  description?: ReactNode;
  /** Child contents will be rendered below the description */
  children?: ReactNode;
}

export default class FormHeader extends Component<Props> {
  render() {
    const { title, description, children } = this.props;

    return (
      <FormHeaderWrapper>
        {title && <FormHeaderTitle>{title}</FormHeaderTitle>}
        {description && (
          <FormHeaderDescription>{description}</FormHeaderDescription>
        )}
        <FormHeaderContent>{children}</FormHeaderContent>
      </FormHeaderWrapper>
    );
  }
}
