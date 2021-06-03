/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import { connect, Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import TableTree, { Cell, Header, Headers, Row, Rows } from '../src';

import staticData from './data-freeform-nodes.json';

const actions = {
  ROOTS_LOADED: 'ROOTS_LOADED',
  CHILDREN_LOADED: 'CHILDREN_LOADED',
};

const selectors = {
  getRoots,
  getChildrenOf,
};
const store = createStore(reducer, applyMiddleware(thunk));

class ReduxTree extends Component {
  componentDidMount() {
    this.props.loadRoots();
  }

  loadChildren = (item) => {
    if (!this.props.areChildrenLoaded(item)) {
      this.props.loadChildren(item);
    }
  };

  render() {
    return (
      <TableTree>
        <Headers>
          <Header width={300}>Chapter title</Header>
          <Header width={100}>Numbering</Header>
        </Headers>
        <Rows
          items={this.props.roots}
          render={({ id, title, numbering, childCount }) => (
            <Row
              onExpand={this.loadChildren}
              expandLabel="Expand"
              collapseLabel="Collapse"
              itemId={numbering}
              items={this.props.getChildrenOf(id)}
              hasChildren={childCount > 0}
            >
              <Cell singleLine>{title}</Cell>
              <Cell singleLine>{numbering}</Cell>
            </Row>
          )}
        />
      </TableTree>
    );
  }
}

const ConnectedReduxTree = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReduxTree);

function mapStateToProps(state) {
  return {
    roots: selectors.getRoots(state),
    getChildrenOf(id) {
      return selectors.getChildrenOf(state, id);
    },
    areChildrenLoaded(item) {
      return item.childCount === item.childIds.length;
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadRoots() {
      dispatch(rootsRequested());
    },
    loadChildren(parentItem) {
      dispatch(childrenRequested(parentItem));
    },
  };
}

export default () => (
  <Provider store={store}>
    <ConnectedReduxTree />
  </Provider>
);

// Reducer
function reducer(
  state = {
    rootIds: [],
    itemsById: {},
  },
  action,
) {
  let newState = state;

  switch (action.type) {
    case actions.ROOTS_LOADED: {
      const rootsById = {};
      for (const root of action.items) {
        rootsById[root.id] = root;
      }
      const rootIds = action.items.map((item) => item.id);
      newState = {
        ...state,
        rootIds: [...state.rootIds, ...rootIds],
        itemsById: { ...state.itemsById, ...rootsById },
      };
      break;
    }

    case actions.CHILDREN_LOADED: {
      const newParent = {
        ...action.parentItem,
        childIds: action.childItems.map((item) => item.id),
      };
      const childrenById = {};
      for (const child of action.childItems) {
        childrenById[child.id] = child;
      }
      newState = {
        ...state,
        itemsById: {
          ...state.itemsById,
          ...childrenById,
          [action.parentItem.id]: newParent,
        },
      };
      break;
    }

    default: {
      break;
    }
  }
  console.log('Reducer: action', action, 'new state', newState);
  return newState;
}

// Selectors
function getRoots(state) {
  return state.rootIds.map((id) => state.itemsById[id]);
}

function getChildrenOf(state, parentId) {
  const { childIds } = state.itemsById[parentId];
  return childIds && childIds.map((childId) => state.itemsById[childId]);
}

// Action creators
function childrenLoaded({ parentItem, childItems }) {
  return {
    type: actions.CHILDREN_LOADED,
    parentItem,
    childItems,
  };
}

function rootsLoaded({ items }) {
  return {
    type: actions.ROOTS_LOADED,
    items,
  };
}

function rootsRequested() {
  return (dispatch) =>
    fetchRoots().then((rootItems) =>
      dispatch(rootsLoaded({ items: rootItems })),
    );
}

function childrenRequested(parentItem) {
  return (dispatch) =>
    fetchChildrenOf(parentItem).then((childItems) =>
      dispatch(childrenLoaded({ parentItem, childItems })),
    );
}

// Fetch utils
function fetchRoots() {
  console.log('GET /roots');
  return Promise.resolve(staticData.children.map(toClientItem));
}

function fetchChildrenOf(node) {
  console.log('GET /children', node);
  return Promise.resolve(node.__serverSide_children.map(toClientItem));
}

function toClientItem(item) {
  const clientItem = {
    ...item,
    childCount: item.children.length,
    childIds: [],
    __serverSide_children: item.children,
    children: undefined,
  };
  delete clientItem.children;
  return clientItem;
}
