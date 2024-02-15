/** @jsx jsx */
/* eslint-disable @repo/internal/react/no-clone-element */
import { cloneElement, Component } from 'react';

import { jsx } from '@emotion/react';

import toItemId from '../../utils/to-item-id';

import Items from './items';

export default class Item extends Component<any> {
  static defaultProps = {
    depth: 0,
  };

  render() {
    // eslint-disable-next-line react/prop-types
    const { depth, data, render, loadingLabel } = this.props;

    const renderedRow = render(data);
    if (!renderedRow) {
      return null;
    }
    const { itemId, items } = renderedRow.props;
    return cloneElement(renderedRow, {
      depth,
      data,
      loadingLabel,
      renderChildren: () => (
        <div id={toItemId(itemId)}>
          <Items
            parentData={data}
            depth={depth}
            items={items}
            render={render}
            loadingLabel={loadingLabel}
          />
        </div>
      ),
    });
  }
}
