import { PureComponent } from 'react';

/** ************************************************************************************************
  This file exists so that we have a component we can pass the @atlaskit/readme Props component
  We reuse the definition to define the itemShape in StatelessMultiSelect as well
**************************************************************************************************/

export default class DummyItem extends PureComponent {
  static defaultProps = {
    isDisabled: false,
    isSelected: false,
  };
}
