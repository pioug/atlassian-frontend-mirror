import { utils } from '@atlaskit/util-service-support';
import {
  ActivityItem,
  ActivityResponse,
  ActivityProvider,
  ActivityContainer,
} from '../types';
import { ActivityError } from './error';

export const makeGetRecentItemBody = (cloudId: string) => ({
  query: `
    query editor_recentActivities($filter: [ActivitiesFilter!], $first: Int) {
      activities {
        myActivities {
          viewed(filters: $filter, first: $first) {
            nodes {
              timestamp,
              object {
                id,
                name,
                type,
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
          cloudIds: [cloudId],
        },
      },
    ],
  },
});

export default class ActivityResource implements ActivityProvider {
  private recentPromise?: Promise<ActivityResponse>;
  private url: string;
  private cloudId: string;
  private options: RequestInit;

  constructor(url: string, cloudId: string, options: RequestInit = {}) {
    this.url = url;
    this.cloudId = cloudId;
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
        body: JSON.stringify(makeGetRecentItemBody(this.cloudId)),
      };

      this.recentPromise = utils.requestService(
        { url: this.url },
        { requestInit: options },
      );
    }

    try {
      const response = await this.recentPromise;
      return response.data.activities.myActivities.viewed.nodes.map(node => ({
        objectId: atob(node.object.id),
        name: node.object.name,
        container: this.getContainerName(node.object.containers),
        url: node.object.url,
        iconUrl: node.object.iconUrl,
        type: node.object.type,
        viewedTimestamp: node.timestamp,
      }));
    } catch (err) {
      throw new ActivityError(err.reason, err.code);
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
