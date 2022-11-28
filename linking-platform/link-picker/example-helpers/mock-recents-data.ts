export interface MockDataV3 {
  ACTIVITIES_DATA: {
    data: {
      activity: {
        myActivity: {
          viewed: {
            edges: any[];
          };
          workedOn: {
            edges: any[];
          };
        };
      };
    };
    extensions?: object;
  };
}

const MOCK_DATA_V3: MockDataV3 = {
  ACTIVITIES_DATA: {
    data: {
      activity: {
        myActivity: {
          workedOn: {
            edges: [],
          },
          viewed: {
            edges: [
              {
                cursor:
                  'WVhKcE9tTnNiM1ZrT21sa1pXNTBhWFI1T2pwMWMyVnlMell4TURFNU5tRmxZamN3TkdJME1EQTJPR0ZpTVRRek5udzNaVGRrT1dFMk5DMWpPRFZqTFRRM1pEVXRPR014TVMwNE5UVmhOelk1TURVeVlXWT18MA==',
                node: {
                  id: 'YXJpOmNsb3VkOmFjdGl2aXR5OkRVTU1ZLWE1YTAxZDIxLTFjYzMtNGYyOS05NTY1LWYyYmI4Y2Q5NjlmNTppdFVtLzE3ZjA5YTQyMWRkOTg5YzFmODY2Njk1ODNkOTk3YmI4ZDNjYzEwMWRkZjc=',
                  object: {
                    id: 'ari:cloud:townsquare:a5a01d21-1cc3-4f29-9565-f2bb8cd969f5:project/cae6f0ae-bd95-439a-835f-d93907a63f23',
                    type: 'project',
                    product: 'townsquare',
                    rootContainerId:
                      'ari:cloud:platform::site/9a257bbc-b7c6-47c8-b1dc-c3db3dc8914b',
                    contributors: [
                      {
                        profile: {
                          name: 'Ashley Hilt',
                          picture: 'https://example.com/my-image/128',
                          accountId: '60ef1ffcb9ef6f00691d644d',
                        },
                      },
                      {
                        profile: {
                          name: 'Trevor Green',
                          picture: 'https://example.com/my-image/128',
                          accountId: '610196aeb704b40068ab1437',
                        },
                      },
                    ],
                    data: {
                      __typename: 'TownsquareProject',
                      key: 'ATL-1262',
                      name: 'FAB-1520: Recent Work',
                      url: 'https://example.com/project/ATL-1262',
                      iconData:
                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAJbUlEQVR4XuWbe1BU1x3HSfpI29h2mr/aOp3OtElmMpk2I2iSUVOWyGt5iIC8ISlVg1W0GlDxAb5qBHxEXaBixDA+BoF7V6Mi+KCgIG/bxlSLNuZhYmJIprWIMRPUb8/vbHaze84+7l2XoHJnPjN3zuP3+/5+9+6559w9189P45Hw5IrvBo4tCQn0N5UaxpQ0GfxLLxj8S64xMMxc41qYJtJGGkmrqN/rwzCu9Kc8aP+SfifO71b6uWamXYxH82F8dMtDgWNKVjJjA04c3CsMUAwUixif24MyZ/A3tTsxeI/CYtF6N/wuwPQbQ0DJB7KRexwWE8Umxutw8Ct/PwZvhWJzdSfQ7+T+uu1dYWp3OiYEjTGtkhvfn1CsDsFbBj0fjPZjyxA8qRLh8QoiMusQvqgNIa/8A4mmdhTv3YX9dUU4e2I+Pm3/PQY6kzHYHYvBnlhc60pGX3smzp2YB/OhYhRV7UGSifr+HeELT3FbYXG13LYhoFT2q58Bh59C0JiSMieN3MOEhEZXISrrGOJX/Q0p5ReRUfMJkhmRr1+CsfwtbFIrcKZpDm53TwZ6onVBfd5smovN6nYYt51BBLOZwmynV/cheetF7jMq6yhCo6q8SgrFzIOnWRMruCo2cEXYlBrEFXQhbddlZKif2Uit7YNxx/uIKe+Bwq7ija54KShv+bxrKqoPbkDMth4YX38PqTV9jr6Zlrj8ToTFVkt63XCVzxiD/E1hTiolyHhSyQUHx1bitr2D8FXdOFKd59XV1srtnhgcqFqGiDU93Keog0gynUdYjLZEUOx+X01zpUp7omc3IkP5VHKWtvMyjC8cQkbkOlyuT5IEDxUfNSQiPWId832QaxB1kdbJs45LcYhQ7H6WhY1caSU8QWUG5UynVV3BJMMOFEzPx+etUySRQ831U7HIn5aPYKYhnWkR9ZFmY6JZiscBFrsfO+mVKuyYWnhGNs5IqXgfhdlLcbNr6G55T9xiP7eN8/KQysYeUR+RsPZNKR6BXkqA21VeQtFbkmErW+rr0d+VKgn7pujvTGUaGiRdVujiifEI9FMCxEIHIjMPS4btyTRf4Yk42VyEK+3TJJG+5uP26TjRXMwDJ9+iHnsiX6yT4hHxmAA2f0b86tOScVfMMH+I/IM9KK0/jD1H96CusQwtzYXoPLkKp1vy8c/WRehtzcG7bXNwqW0Wh86pjOpOtxTwttSH+pINskU2ybbozxXxq05z7VI8uhNAsInGZPYkSN/rPuN3AzQgRmc3ap4caUvAVzSaZqDCvBszVO1X4puCNFWou9FYMkPS7Q7NCZg6aT0GG4IAdSxuKBNxUlmMIvUIpg9jMsh3sdqAFiWPa4IawDQaEB+0QdLvCs0JUIpmWwaizgjguAF44xlACcBN5RlcUDJwQFmHElXFEqUbmerHktg7hWwuUbu4j4NqEf6tZnDfpIFrIU2kjWmsWTtH0u8KTQmY/Nyr+KLNyWSn3Qg0sruibjxgHmcRw7iljMMVJRpnlWk4pS5Ag7IG1UoZdqg7UabWwqSYsVE9hEL1GIfOqYzqqE21Wsr7UF+yQbbIptU+90U+yXdbuKTrxqkpXLMYhzM0JWBL7gLJiVM6WEJaQoG/Pg8cCwTq2W154Flgn514LbCfGe9DfQ9PAI4GWmy2hFh8iH6dsClnoRSHMzQloFdJkxx4TWek5VbtiLBcPYLOqYzqxPZe8i8lXYrDGR4TQAPKUK7whgrSHBu4UYpHxGMCVs9cKhnXyu3uKLy3/zmc2f00Pjs2Sap3BbWlPtSXbIj1WlmZtUyKR8RjAtTibMmwFi6qE5GfMgovhfhxskL9UP7yz3G9RR60rFDd1vk/422t/QpSR+GdfROltlqoLcyW4hHxmIDunZmSYU+8bZ6A2cYHbUHY8+cXf8yeKJbHlT1fnDJi9Qs/ktoTsyO+hYtm/UnoqMyU4hHxmICPGvS96PiyIxJLkx+2iX8tdzRa/vIUv5LWspqVv5L6VbMya/3ytFFo3foUXssZbStbxmwOdugbJD88nCTFI+IxAf0n4yTD7qhf/4RD8Le7LeX/awrFovjv8fI/hj+ITxqet/W5wmaYM8Me4HXU5mpTCC+nvmTDaq9h4xOSP3dcbY6X4hHxmIDBDn1PgMWJP+Bi/xT9HVw7EeZQ17Hd3xaMsvrXtnI6t5Z3Vfg79CEbc6O+zevItujPHV+2x0jxiPg8AdZb3bzmUanuVlcUVqT9kNcfKHzcVr7/lcd4WX7Kw7jlZNR/Y+3jvJ5+GmKdO3ySAL0/gf7mUJzb+6zTQIgBNtKL9XROZf3CHWNff75mvMt6V/jkJ3C5PlEyfK/gk0HQm8fg3YJPHoPeToTuBnwyEbqTqfBws+IlH0yFaUGhdTFEI3/RtEfwwcFAqe5OIZuF03+CfWsek+qc4bPFEEFLS9GBM95WJ/AJTVboA3ze33fk68mOt/ynMRi7lv4SM5lNsk0+xDbOOFuTIcXhDE0J2JK7UHLgimObnrRNamaxGd/2BaNxvna8rlUdtaU+1JdsWO0dZ7bFtq549WUfvhCh10v0mkl04grrxMae3NiHULn4FzhR9lu+zP1vYwibqERw6JzKqI7aUFuxP02GRD+u8PkrMYJGVNGRO+hqWef3dwKtG45v1n7liWpfvxQl6LW4nruAoHX8spSvV4Z6oanxu+zOEO26g/41jjMMwWtxonxJjuTQE4OdkfzWzkv4vhSgK6jtSdbnphfvCMsW5Uq63aErAcHjTLiwz7t/g2lgoxcl/FE5/RH+O6cBjqBzKqM6epOkZ8C054I5jWsUdbtDVwKItPBiXG+NlZwPN7RJI8NYJOn1hO4EELQzgzYniCKGC9KyJHO5pFMLlAC3GyRcsX5eniRkOKAZ37q5eZI+jfANEm63yLijMHvxsG+R2TBvkaRLB70eN0l5YtkfCvijRxQ31NA45O1tb4M2SWnZJueJdGOx108Hb6DRngZjUYde+DY5rRslPTFprAmmBQuH9G6gf6grl89H8NP6HnWu4Bsl9W6V9QT9l1hTOEf3rNEdZIv+89czw9OAZaus15ulPUCLkc05C3GuNl3z+wR7qA8taelv7uiJ2hY2erBtlqbDZ9vlXTDFsJH/UUkLqs7KTFyqS+Zvm+mVO0HnVEZ11IbaUh/Rjg9x3C5Px4j+YIKOEf/JDB0j+qMp6zGiP5uzHiP6w0nrMaI/nbU/RuzH0+Jxv34+/397Kb3Gi0FKTQAAAABJRU5ErkJggg==',
                      id: 'ari:cloud:townsquare:a5a01d21-1cc3-4f29-9565-f2bb8cd969f5:project/cae6f0ae-bd95-439a-835f-d93907a63f23',
                    },
                  },
                  event: {
                    id: '17f09a421dd989c1f86669583d997bb8d3cc101ddf7',
                    timestamp: '2022-02-17T21:43:45Z',
                    eventType: 'viewed',
                  },
                },
              },
              {
                cursor:
                  'WVhKcE9tTnNiM1ZrT21sa1pXNTBhWFI1T2pwMWMyVnlMelZrWmpCaFltUmpOMlJqTURNMk1HVmpaRFF5TXpkalludzBNVGc1WWpVek9DMHhPV1UwTFRSak16VXRPR00xWkMxaFl6ZzFPV1ppTWpGaU1qUT18MA==',
                node: {
                  id: 'YXJpOmNsb3VkOmFjdGl2aXR5OjlhMjU3YmJjLWI3YzYtNDdjOC1iMFRjLWMzZGIzYWM4OTU0YjppdGVtLzE4MTAzNTRiYTRmMWQwNDQ1MzdhMWJjMWM5NDVmZTIwMWYwZGNkZjQyYTA=',
                  object: {
                    id: 'ari:cloud:confluence:9a257bbc-b7c6-47c8-b1dc-c3db3dc8954b:page/539197607',
                    type: 'page',
                    product: 'confluence',
                    rootContainerId:
                      'ari:cloud:platform::site/9a257bbc-b7c6-47c8-b1dc-c3db3dc8954b',
                    contributors: [
                      {
                        profile: {
                          name: 'Joleen Roberson',
                          picture: 'https://example.com/my-image/128',
                          accountId: '61ce114bce3622006a7cd505',
                        },
                      },
                      {
                        profile: {
                          name: 'Erika Cox',
                          picture: 'https://example.com/my-image/128',
                          accountId: '5df0abdc7dc0260ecd0237cb',
                        },
                      },
                    ],
                    data: {
                      __typename: 'ConfluencePage',
                      links: {
                        webUi:
                          '/spaces/~61ce114bce3652006a7cd505/pages/539197607/Decision',
                        base: 'https://example.com/wiki',
                      },
                      id: 'ari:cloud:confluence:9a257bbc-b7c6-47c8-b1dc-c3db3ac8954b:page/539197607',
                      title: 'FAB-1558 Decision',
                      pageId: '539197607',
                      space: { name: 'Joleen Roberson' },
                    },
                  },
                  event: {
                    id: '1810354ba4f1d044537a1bc1c945fe201f0dcdf42a0',
                    timestamp: '2022-05-27T02:24:53.000Z',
                    eventType: 'viewed',
                  },
                },
              },
              {
                cursor:
                  'WVhKcE9tTnNiM1ZrT21sa1pXNTBhWFI1T2pwMWMyVnlMelZrWmpCaFltFmpOMlJqTURNMk1HVmpaREF5TXpkalludzBNVGc1WWpVek9DMHhPV1UwTFRSak16VXRPR00xWkMxaFl6ZzFPV1ppTWpGaT1qUT18MA==',
                node: {
                  id: 'YXJpOmNsb3VkOmFjdGl2aXR5OjlhMjU3YmJjLWI3YzYtNDdjOC1iFWRjLWMzZGIzYWM4OTU0YjppdGVtLzE4MTAzNTRiYTRmMWQwNDQ1MzdhMWJjMWM5NDVmZTIwMWYwZGNkZjQyYTB=',
                  object: {
                    id: 'ari:cloud:confluence:9a357bbc-b7c6-47c8-b1dc-c3db3ac8954b:page/539197608',
                    type: 'page',
                    product: 'confluence',
                    rootContainerId:
                      'ari:cloud:platform::site/9a357bbc-b7c6-47c8-b1dc-c3db3ac8954b',
                    contributors: [
                      {
                        profile: {
                          name: 'Carlos Dyer',
                          picture: 'https://example.com/my-image/128',
                          accountId: '61ce114bce3652006a7cd505',
                        },
                      },
                      {
                        profile: {
                          name: 'Martha Sanders',
                          picture: 'https://example.com/my-image/128',
                          accountId: '5df0abdc7dc0360ecd0237cb',
                        },
                      },
                    ],
                    data: {
                      __typename: 'ConfluencePage',
                      links: {
                        webUi:
                          '/spaces/~61ce114bce3652006a7cd505/pages/539197607/Other',
                        base: 'https://example.com/wiki',
                      },
                      id: 'ari:cloud:confluence:9a357bbc-b7c6-47c8-b1dc-c3db3ac8954b:page/539197608',
                      title: 'FAB-996 Other one',
                      pageId: '539197608',
                      space: { name: 'Cool space with a very long name' },
                    },
                  },
                  event: {
                    id: '1810354ba4f1d044537a1bc1c945fe201f0dcdf42a0',
                    timestamp: '2022-05-27T02:24:53.000Z',
                    eventType: 'viewed',
                  },
                },
              },
              {
                cursor:
                  'WVhKcE9tTnNiM1ZrT21sa1pXNTBhWFI1T2pwMWMyVnlMell4TURFNU5tRmxZamF3TkdJME1EQTJPR0ZpTVRRek5ueGhPR1JqTnpCbU9TMWlNV05rTFRRNE1qWXRPVEUzT0MxbVltVTVNRGxrWldKaE1HST18MA==',
                node: {
                  id: 'YXJpOmNsb3VkOmFjdGl2aXR5OkRVTU1ZLWE1YTAxZDIxLTFjYzMtNGYyOS05NFY1LWYyYmI4Y2Q5NjlmNTppdGVtLzE3ZjA1ZWFhM2ZjMGE3MWEwOWRjYjI4YTE2MTBiOWMyZmFmOWUxMjU1YjQ=',
                  object: {
                    id: 'ari:cloud:townsquare:a3a01d21-1cc3-4f29-9565-f2bb8cd969f5:project/cae6f0ae-bd95-439a-835f-d93907a63f53',
                    type: 'project',
                    product: 'townsquare',
                    rootContainerId:
                      'ari:cloud:platform::site/9a257bbc-b7c6-47c8-b1dc-c3db3dc8914b',
                    contributors: [
                      {
                        profile: {
                          name: 'Marcelino King',
                          picture: 'https://example.com/my-image/128',
                          accountId: '60ef1ffcb9ef6f00691d633d',
                        },
                      },
                      {
                        profile: {
                          name: 'Tonya Riley',
                          picture: 'https://example.com/my-image/128',
                          accountId: '610196aeb704b40068ab1436',
                        },
                      },
                    ],
                    data: {
                      __typename: 'TownsquareProject',
                      key: 'XD-1261',
                      name: 'FAB-983 Woah woah this title is rather long I wonder what it will do!',
                      url: 'https://example.com/project/XD-1261',
                      iconData:
                        'data:image/png;base64,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',
                      id: 'ari:cloud:townsquare:a3a01d21-1cc3-4f29-9565-f2bb8cd969f5:project/cae6f0ae-bd95-439a-835f-d93907a63f23',
                    },
                  },
                  event: {
                    id: '17f05eaa3fc0a71a09dcb28a1610b9c2faf9e1255b4',
                    timestamp: '2022-02-17T04:22:17Z',
                    eventType: 'updated',
                  },
                },
              },
              {
                cursor:
                  'WVhKcE9tTnNiM1ZrT21sa1pXNTBhWFI1T2pwMFMyVnlMelZrWmpCaFltUmpOMlJqTURNMk1HVmpaREF5TXpkalludzBNVGc1WWpVek9DMHhPV1UwTFRSak16VXRPR00xWkMxaFl6ZzFPV1ppTWpGaU1qUT18Ng==',
                node: {
                  id: 'YXJpOmNsb3VkOmFjdGl2aXR5OkRVTU1ZLWEFYTAxZDIxLTFjYzMtNGYyOS05NTY1LWYyYmI4Y2Q5NjlmNTppdGVtLzE4MGFiNThjZDdlYzJhOWRhZjAyMzU0ZTIzZTExYTY5OWQzZGNlZGZkNDk=',
                  object: {
                    id: 'ari:cloud:confluence:a4a01d21-1cc3-4f29-9565-f2bb8cd969f5:page/452269311391',
                    type: 'page',
                    product: 'confluence',
                    rootContainerId:
                      'ari:cloud:platform::site/a4a01d21-1cc3-4f29-9565-f2bb8cd969f5',
                    contributors: [
                      {
                        profile: {
                          name: 'Sharon Haugen',
                          picture: 'https://example.com/my-image/128',
                          accountId:
                            '655363:f87158bb-15fc-48a9-a396-744a9fbe9ed7',
                        },
                      },
                      {
                        profile: {
                          name: 'Nicolette Espinosa',
                          picture: 'https://example.com/my-image/128',
                          accountId: '5c36c7dd13a8bb0b103988fe',
                        },
                      },
                      {
                        profile: {
                          name: 'Suzanne Goldberg',
                          picture: 'https://example.com/my-image/128',
                          accountId: '6232212a62dc1e006802dea8',
                        },
                      },
                    ],
                    data: {
                      __typename: 'ConfluencePage',
                      links: {
                        webUi:
                          '/spaces/~655363f87158bb15fc48a9a396744a9fbe9ed7/pages/452269311391/Testtest',
                        base: 'https://example.com/wiki',
                      },
                      id: 'ari:cloud:confluence:DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5:page/452269311391',
                      title: 'FAB-1166 Testtest',
                      pageId: '452269311391',
                      space: { name: 'Sharon Haugen' },
                    },
                  },
                  event: {
                    id: '180ab58cd7ec2a9daf02354e23e11a699d3dcedfd49',
                    timestamp: '2022-05-10T00:22:45.000Z',
                    eventType: 'viewed',
                  },
                },
              },
            ],
          },
        },
      },
    },
    extensions: {
      activity: {
        query_info: {
          methods: [
            {
              name: 'viewed',
              version: 'V3',
            },
          ],
          operationName: 'nadel_2_activity_sdfghd',
          isFetchingMyActivities: true,
        },
      },
      gateway: {
        request_id: '351fc075dbed201d',
        deprecatedFieldsUsed: [],
        schema: {
          schemaName: 'central',
          commitHash: 'dcaf893115bbeb69ae428cff33ce7beea0807343',
          schemaHash: '',
          snapshot: '1348',
          buildNumber: '10346',
          buildTimestamp: '2022-02-23T00:39:59.104715Z',
        },
        micros_env: 'stg-west',
        invokedServices: [
          'activity',
          'identity',
          'townsquare',
          'gira',
          'cc_graphql',
        ],
      },
    },
  },
};

export default MOCK_DATA_V3;
