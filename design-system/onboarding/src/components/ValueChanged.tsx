import React, { ReactNode } from 'react';

interface Props {
  value: any;
  onChange: Function;
  children: ReactNode;
}

// This component was born from the pain of using render props in lifecycle methods.
// On update, it checks whether the current value prop is equal to the previous value prop.
// If they are different, it calls the onChange function.
// We use this for updating Popper when the SpotlightDialog width changes.
export default class ValueChanged extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value) {
      this.props.onChange();
    }
  }

  render() {
    return this.props.children;
  }
}
