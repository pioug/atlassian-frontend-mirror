import React, { Component } from 'react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '../src';

const ROOTS = [
  {
    title: 'Chapter 1: Clean Code',
    page: 1,
    numbering: '1',
    hasChildren: true,
  },
  {
    title: 'Chapter 2: Meaningful names',
    page: 17,
    numbering: '2',
  },
  {
    title: 'Chapter 3: Functions',
    page: 17,
    numbering: '3',
    hasChildren: true,
  },
  {
    title: 'Chapter 4: Comments',
    page: 53,
    numbering: '4',
    children: [],
  },
  {
    title: 'Chapter 5: Formatting',
    page: 75,
    numbering: '5',
    children: [],
  },
];

const CHILDREN = [
  {
    title: 'There Will Be Code',
    page: 2,
    numbering: '1.1',
    hasChildren: true,
  },
  {
    title: 'Bad code',
    page: 3,
    numbering: '1.2',
  },
  {
    title: 'The Total Cost of Owning a Mess',
    page: 4,
    numbering: '1.3',
    hasChildren: true,
  },
];

function fetchRoots() {
  return Promise.resolve(ROOTS);
}

function fetchChildrenOf() {
  return Promise.resolve(CHILDREN);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component {
  state = {
    roots: null,
  };

  componentDidMount() {
    fetchRoots().then((roots) => {
      this.setState({
        roots,
      });
    });
  }

  loadChildren = (parentItem) => {
    if (parentItem.children) {
      return;
    }

    fetchChildrenOf().then((childItems) => {
      // eslint-disable-next-line
      parentItem.children = childItems;
      this.forceUpdate();
    });
  };

  render() {
    return (
      <TableTree>
        <Headers>
          <Header width={300}>Chapter title</Header>
          <Header width={100}>Numbering</Header>
          <Header width={100}>Page</Header>
        </Headers>
        <Rows
          items={this.state.roots}
          render={({ title, numbering, page, hasChildren, children }) => (
            <Row
              expandLabel="Expand"
              collapseLabel="Collapse"
              itemId={numbering}
              onExpand={this.loadChildren}
              items={children}
              hasChildren={hasChildren}
            >
              <Cell singleLine>{title}</Cell>
              <Cell singleLine>{numbering}</Cell>
              <Cell singleLine>{page}</Cell>
            </Row>
          )}
        />
      </TableTree>
    );
  }
}
