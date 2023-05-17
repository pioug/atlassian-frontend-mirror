/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { DatasourceType } from '@atlaskit/linking-types';

import * as Image from '../examples-helpers/images.json';
import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import { fallbackRenderType } from '../src/ui/issue-like-table/render-type';

const ContainerWrapper = styled.div`
  width: 70%;
  margin: 2em auto;
  padding: 0 1em;
`;

const RenderDiv = styled.div`
  margin: 6px 0;
`;

const tableHeaderStyles = css({
  width: '200px',
});

const tableRowStyles = css({
  borderBottom: '1px solid #DFE1E6',
});

interface Item {
  type: DatasourceType['type'];
  variations: DatasourceType['value'][];
}

const items: Item[] = [
  {
    type: 'number',
    variations: [123, 123.456, -98, -98.777],
  },
  {
    type: 'date',
    variations: ['11/11/2023', '2023-04-20T23:00:00.000Z'],
  },
  {
    type: 'time',
    variations: ['11/11/2023', '2023-04-20T23:00:00.000Z'],
  },
  {
    type: 'datetime',
    variations: ['11/11/2023', '2023-04-20T23:00:00.000Z'],
  },
  {
    type: 'string',
    variations: ['Hello World'],
  },
  {
    type: 'boolean',
    variations: [true, false],
  },
  {
    type: 'status',
    variations: [
      {
        status: 'default',
        text: 'Default',
      },
      {
        status: 'inprogress',
        text: 'In Progress',
      },
    ],
  },
  {
    type: 'link',
    variations: [
      {
        text: 'Atlassian Website',
        url: '#',
      },
      {
        url: 'https://app.asana.com/',
      },
      {
        text: 'EDM-5941',
        url: '#',
        linkType: 'key',
      },
      {
        url: 'https://product-fabric.atlassian.net/browse/EDM-5941',
      },
      {
        url: 'https://link-that-does-not-resolve.com',
      },
    ],
  },
  {
    type: 'icon',
    variations: [
      {
        source: Image.trello,
      },
    ],
  },
  {
    type: 'user',
    variations: [
      {},
      {
        avatarSource: Image.trello,
      },
      {
        avatarSource: Image.trello,
        displayName: 'Trello',
      },
    ],
  },
  {
    type: 'tag',
    variations: ['Simple Tag'],
  },
];

export default () => {
  return (
    <IntlProvider locale="en">
      <SmartCardProvider client={new SmartLinkClient()}>
        <ContainerWrapper data-testid="link-datasource--render-all-types">
          <table>
            <thead>
              <tr>
                <th css={tableHeaderStyles}>Type</th>
                <th>Variations</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr css={tableRowStyles} key={index}>
                  <td>{item.type}</td>
                  <td>
                    {item.variations.map((variation, index) => (
                      <RenderDiv key={index}>
                        {fallbackRenderType({
                          type: item.type,
                          value: variation,
                        } as DatasourceType)}
                      </RenderDiv>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ContainerWrapper>
      </SmartCardProvider>
    </IntlProvider>
  );
};
