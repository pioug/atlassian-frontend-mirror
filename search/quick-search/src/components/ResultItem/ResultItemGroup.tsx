import React from 'react';
import { ItemGroup } from '@atlaskit/item';
import { ResultItemGroupTitle, ResultItemGroupHeader } from './styled';

type Props = {
  /** Text to appear as heading above group. Will be auto-capitalised. */
  title: React.ReactNode;
  /** React Elements to be displayed within the group. This should generally be a collection of ResultItems. */
  children?: React.ReactNode;
};

export default class ResultItemGroup extends React.Component<Props> {
  render() {
    const { title, children } = this.props;

    const wrappedTitle = (
      <ResultItemGroupHeader>
        <ResultItemGroupTitle>{title}</ResultItemGroupTitle>
      </ResultItemGroupHeader>
    );

    return <ItemGroup title={wrappedTitle}>{children}</ItemGroup>;
  }
}
