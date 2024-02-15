/**
 * HELLO DEV :wave
 * If you are here to change these queries, please also remember to update the query in jira/src/packages/platform/linking/link-datasource/src/index.tsx
 * We have the entry in @atlassian/jira-linking-platform-link-datasource to ensure that, if a developer makes a breaking change to the schema,
 * then the relay compiler start yelling, and it can help the dev to notify us.
 */

export const hydrateJQLQuery = `query hydrate($cloudId: ID!, $jql: String!) {
  jira {
    jqlBuilder(cloudId: $cloudId) {
      hydrateJqlQuery(query: $jql) {
        ... on JiraJqlHydratedQuery {
          fields {
            ... on JiraJqlQueryHydratedField {
              jqlTerm
              values {
                ... on JiraJqlQueryHydratedValue {
                  values {
                    ... on JiraJqlProjectFieldValue {
                      jqlTerm
                      displayName
                      project {
                        avatar {
                          small
                        }
                      }
                    }
                    ... on JiraJqlStatusFieldValue {
                      jqlTerm
                      displayName
                      statusCategory {
                        colorName
                      }
                    }
                    ... on JiraJqlIssueTypeFieldValue {
                      jqlTerm
                      displayName
                      issueTypes {
                        avatar {
                          small
                        }
                      }
                    }
                    ... on JiraJqlUserFieldValue {
                      jqlTerm
                      displayName
                      user {
                        picture
                      }
                    }
                    ... on JiraJqlGroupFieldValue {
                      jqlTerm
                      displayName
                      group {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

export const fieldValuesQuery = `query fieldValues($cloudId: ID!, $first: Int = 10, $jqlTerm: String!, $jql: String!, $searchString: String!, $after: String) {
  jira {
    jqlBuilder(cloudId: $cloudId) {
      fieldValues(
        first: $first
        jqlTerm: $jqlTerm
        jqlContext: $jql
        searchString: $searchString
        after: $after
      ) {
        totalCount
        pageInfo {
          endCursor
        }
        edges {
          node {
            jqlTerm
            displayName
            ... on JiraJqlProjectFieldValue {
              project {
                avatar {
                  small
                }
              }
            }
            ... on JiraJqlIssueTypeFieldValue {
              issueTypes {
                avatar {
                  small
                }
              }
            }
            ... on JiraJqlStatusFieldValue {
              statusCategory {
                colorName
              }
            }
            ... on JiraJqlUserFieldValue {
              user {
                picture
              }
            }
            ... on JiraJqlGroupFieldValue {
              group {
                name
              }
            }
          }
        }
      }
    }
  }
}`;
