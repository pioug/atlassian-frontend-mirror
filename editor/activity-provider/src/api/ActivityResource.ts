import { utils } from '@atlaskit/util-service-support';
import {
  ActivityItem,
  ActivityResponse,
  ActivityProvider,
  ActivityContainer,
} from '../types';

export const GET_RECENT_ITEM_BODY = {
  query: `
    query editor_recentActivities($filter: [ActivitiesFilter!], $first: Int) {
      activities {
        myActivities {
          all(filters: $filter, first: $first) {
            nodes {
              timestamp,
              object {
                id,
                name,
                url,
                iconUrl,
                containers {
                  name,
                }
              }
            }
          }
        }
      }
    }
  `,
  variables: {
    first: 200,
    filter: [
      {
        type: 'AND',
        arguments: {
          objectTypes: ['ISSUE', 'PAGE', 'BLOGPOST'],
          eventTypes: ['VIEWED', 'EDITED', 'PUBLISHED'],
        },
      },
    ],
  },
};

export default class ActivityResource implements ActivityProvider {
  private recentPromise?: Promise<ActivityResponse>;
  private url: string;
  private options: RequestInit;

  constructor(url: string, options: RequestInit = {}) {
    this.url = url;
    this.options = options;
  }

  public async getRecentItems() {
    if (!this.recentPromise) {
      const options: RequestInit = {
        mode: 'cors',
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        ...this.options,
        body: JSON.stringify(GET_RECENT_ITEM_BODY),
      };

      this.recentPromise = utils.requestService(
        { url: this.url },
        { requestInit: options },
      );
    }

    try {
      const response = await this.recentPromise;
      return response.data.activities.myActivities.all.nodes.map<ActivityItem>(
        node => ({
          objectId: node.object.id,
          name: node.object.name,
          container: this.getContainerName(node.object.containers),
          url: node.object.url,
          iconUrl: node.object.iconUrl,
        }),
      );
    } catch (e) {
      // We will add instrumentations in the next PR
      return [];
    }
  }

  public async searchRecent(query: string) {
    const items = await this.getRecentItems();
    return this.filterItems(items, query);
  }

  /**
   * It should return the closet container's name
   */
  private getContainerName(containers: Array<ActivityContainer>): string {
    for (let i = containers.length - 1; i >= 0; --i) {
      const containerName = containers[i].name;
      if (containerName) {
        return containerName;
      }
    }
    return '';
  }

  private filterItems(
    items: Array<ActivityItem>,
    searchTerm: string,
  ): Array<ActivityItem> {
    if (!searchTerm) {
      return [];
    }

    return items.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
