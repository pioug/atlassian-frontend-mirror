import React, { Component, type ComponentType } from 'react';

import EmptyState from '@atlaskit/empty-state';

import TableTree, {
  Cell,
  Header,
  Headers,
  Row,
  Rows,
  TableTreeDataHelper,
} from '../src';

import exampleImage from './img/example-image.png';

let uuid = 0;

type Item = (typeof ROOTS)[number] & { component: ComponentType<any> };

const ROOTS = [
  {
    title: 'Chapter 1: Clean code',
    id: ++uuid,
    page: 1,
    numbering: '1',
    hasChildren: true,
  },
  {
    title: 'Chapter 2: Meaningful names',
    id: ++uuid,
    page: 17,
    numbering: '2',
    hasChildren: true,
  },
];

function getChildren(parentItem: any) {
  if (parentItem.id === 1) {
    return [
      {
        component: EmptyState,
        id: ++uuid,
      },
    ];
  }
  return [
    {
      title: 'There will be code',
      id: ++uuid,
      page: 2,
      numbering: '1.1',
      hasChildren: true,
    },
    {
      title: 'Bad code',
      id: ++uuid,
      page: 3,
      numbering: '1.2',
    },
    {
      title: 'The cost of owning a mess',
      id: ++uuid,
      page: 4,
      numbering: '1.3',
      hasChildren: true,
    },
  ];
}

function fetchRoots() {
  return Promise.resolve(ROOTS);
}

function fetchChildrenOf(parentItem: Item) {
  return Promise.resolve(getChildren(parentItem));
}

function getData(parentItem?: Item) {
  return !parentItem ? fetchRoots() : fetchChildrenOf(parentItem);
}

const tableTreeHelper = new TableTreeDataHelper({ key: 'id' });

export default class WithDifferentChildComponent extends Component {
  state = { items: [] as Item[] };

  componentDidMount() {
    this.loadTableData();
  }

  loadTableData = (parentItem?: any) => {
    if (parentItem && parentItem.childIds) {
      return;
    }

    getData(parentItem).then((items) => {
      this.setState({
        items: tableTreeHelper.updateItems(items, this.state.items, parentItem),
      });
    });
  };

  render() {
    const { items } = this.state;
    return (
      <TableTree>
        <Headers>
          <Header width={300}>Chapter title</Header>
          <Header width={120}>Numbering</Header>
          <Header width={100}>Page</Header>
        </Headers>
        <Rows
          items={items}
          render={({
            title,
            numbering,
            page,
            hasChildren,
            children,
            component: CustomComponent,
          }) =>
            CustomComponent ? (
              <CustomComponent
                header="I am the header"
                imageUrl={exampleImage}
              />
            ) : (
              <Row
                expandLabel="Expand"
                collapseLabel="Collapse"
                itemId={numbering}
                onExpand={this.loadTableData}
                items={children}
                hasChildren={hasChildren}
              >
                <Cell singleLine>{title}</Cell>
                <Cell singleLine>{numbering}</Cell>
                <Cell singleLine>{page}</Cell>
              </Row>
            )
          }
        />
      </TableTree>
    );
  }
}
