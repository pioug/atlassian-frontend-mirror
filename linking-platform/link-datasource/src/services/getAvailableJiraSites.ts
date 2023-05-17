export interface Site {
  cloudId: string;
  displayName: string;
  url: string;
}

export const getAvailableJiraSites = async (): Promise<Site[]> => {
  const requestConfig = {
    method: 'POST',
    credentials: 'include' as RequestCredentials,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products: [
        'jira-software.ondemand',
        'jira-core.ondemand',
        'jira-incident-manager.ondemand',
        'jira-product-discovery',
        'jira-servicedesk.ondemand',
      ],
    }),
  };

  const response = await fetch(`/gateway/api/available-sites`, requestConfig);

  if (response.ok) {
    const res = await response.json();
    return res.sites;
  }

  throw new Error((await response.text()) || 'Something went wrong');
};
