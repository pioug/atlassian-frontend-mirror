import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, OlHTMLAttributes, ComponentClass, BaseHTMLAttributes } from 'react';

const WrapperStyles = `
  /*
    Increasing specificity with double ampersand to ensure these rules take
    priority over the global styles applied to 'ol' elements.
  */
  && {
    list-style-type: none;
    padding-left: 0;
  }
`;

const TaskListWrapper: ComponentClass<HTMLAttributes<
  HTMLDivElement
>> = styled.div`
  ${WrapperStyles}
`;

const DecisionListWrapper: ComponentClass<HTMLAttributes<
  HTMLOListElement
>> = styled.ol`
  ${WrapperStyles}
`;

export { TaskListWrapper, DecisionListWrapper };
