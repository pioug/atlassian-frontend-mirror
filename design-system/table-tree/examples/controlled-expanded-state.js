import React, { PureComponent } from 'react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '../src';

import staticData from './data-cleancode-toc.json';

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends PureComponent {
  state = {
    expansionMap: {},
  };

  render() {
    const { expansionMap } = this.state;

    return (
      <div>
        <TableTree>
          <Headers>
            <Header width={200}>Chapter title</Header>
            <Header width={100}>Numbering</Header>
            <Header width={100}>Page</Header>
          </Headers>
          <Rows
            items={staticData.children}
            render={({ title, numbering, page, children }) => (
              <Row
                itemId={numbering}
                items={children}
                hasChildren={children.length > 0}
                isExpanded={Boolean(expansionMap[numbering])}
                onExpand={() =>
                  this.setState({
                    expansionMap: {
                      ...expansionMap,
                      [numbering]: true,
                    },
                  })
                }
                onCollapse={() =>
                  this.setState({
                    expansionMap: {
                      ...expansionMap,
                      [numbering]: false,
                    },
                  })
                }
              >
                <Cell singleLine>{title}</Cell>
                <Cell>{numbering}</Cell>
                <Cell>{page}</Cell>
              </Row>
            )}
          />
        </TableTree>
      </div>
    );
  }
}
