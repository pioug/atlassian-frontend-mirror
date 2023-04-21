/** @jsx jsx */
import { PureComponent } from 'react';

import { css, jsx } from '@emotion/react';

import Select from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import TableTree, {
  Cell,
  Header,
  Headers,
  Row,
  Rows,
  TableTreeDataHelper,
} from '../src';

const tableTreeDataHelper = new TableTreeDataHelper<Item>({ key: 'id' });

type Item = {
  numbering?: string;
  title?: string;
  id?: string;
  numberingPath: string;
};

function getItemsData(parent?: Item, count?: number) {
  return generateChildItems(parent || { numberingPath: '' }, count || 0);
}

function generateChildItems(parent: Item, count: number) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const number = i + 1;
    const numbering = `${parent.numberingPath}${number}`;
    items.push({
      numbering,
      title: `Item ${numbering}`,
      numberingPath: `${numbering}.`,
      id: `${parent.numberingPath}${number}`,
    });
  }
  return items;
}

const performanceTweakContainerStyles = css({
  width: '450px',
  padding: token('space.250', '20px'),
  position: 'fixed',
  right: token('space.0', '0px'),
  bottom: token('space.0', '0px'),
  background: token('elevation.surface', 'rgba(100%, 100%, 100%, 0.8)'),
  border: `5px solid ${token('color.border', 'rgba(0, 0, 0, 0.8)')}`,
  borderWidth: '5px 0 0 5px',
});

const childCountPerItem = 100;
const childCountOptions = [
  {
    label: 10,
    value: 10,
  },
  {
    label: 20,
    value: 20,
  },
  {
    label: 50,
    value: 50,
  },
  {
    label: 100,
    value: 100,
  },
  {
    label: 200,
    value: 200,
  },
  {
    label: 500,
    value: 500,
  },
  {
    label: 1000,
    value: 1000,
  },
];

type ChildCount = typeof childCountOptions[number];

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends PureComponent {
  state = {
    childCount: childCountPerItem,
    totalCount: childCountPerItem,
    selectedChildCountOption: childCountOptions[3],
    items: tableTreeDataHelper.updateItems(getItemsData(undefined, 100)),
  };

  handleExpand = (parentItem?: Item) => {
    this.setState({
      items: tableTreeDataHelper.updateItems(
        getItemsData(parentItem, 100),
        this.state.items,
        parentItem,
      ),
      totalCount:
        this.state.totalCount + this.state.selectedChildCountOption.value,
    });
  };

  handleItemsCountChange = (option: ChildCount) => {
    this.setState({
      selectedChildCountOption: option,
    });
  };

  render() {
    const { items } = this.state;
    return (
      <div style={{ position: 'relative' }}>
        <TableTree>
          <Headers>
            <Header width={300}>Chapter title</Header>
            <Header width={100}>Numbering</Header>
            <Header width={100}>Stuff</Header>
          </Headers>
          <Rows
            items={items}
            render={({ title, numbering, children }) => (
              <Row
                itemId={numbering}
                hasChildren
                onExpand={this.handleExpand}
                items={children}
              >
                <Cell singleLine>{title}</Cell>
                <Cell singleLine>{numbering}</Cell>
                <Cell singleLine>
                  <strong>B</strong>
                  <em>I</em>
                </Cell>
              </Row>
            )}
          />
        </TableTree>
        <div css={performanceTweakContainerStyles}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>Tree children per item:</div>
            <div style={{ width: '90px', margin: '0 20px 0 10px' }}>
              <Select
                autoFocus={false}
                menuPosition="fixed"
                options={childCountOptions}
                onChange={this.handleItemsCountChange as any}
                value={this.state.selectedChildCountOption}
                placeholder="choose"
              />
            </div>
            <div>
              Items loaded total: <strong>{this.state.totalCount}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
