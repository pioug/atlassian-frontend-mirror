import uuid from 'uuid/v1';
import { Props as ObjectResultProps } from '../../src/components/Results/ObjectResult';
import { Props as ContainerResultProps } from '../../src/components/Results/ContainerResult';
import { Props as PersonResultProps } from '../../src/components/Results/PersonResult';

function pickRandom<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

const mockCatchPhrases = [
  'Focused bandwidth-monitored open system',
  'Synergistic multi-tasking architecture',
  'Robust national conglomeration',
  'Mandatory heuristic groupware',
  'Triple-buffered multi-tasking methodology',
  'Reduced dedicated initiative',
  'Triple-buffered analyzing superstructure',
  'Optimized intangible initiative',
];

const mockCompanyNames = [
  'Gusikowski, Schimmel and Rau',
  'Gaylord, Kreiger and Hand',
  'Harber - Rowe',
  'Senger Group',
  'McGlynn, McLaughlin and Connelly',
  'Kovacek Inc',
  'Muller - Ortiz',
  'Heaney, Heller and Corwin',
];

const mockUrls = [
  'https://jacquelyn.name',
  'https://sheridan.net',
  'http://carmelo.info',
  'https://zoe.biz',
  'https://kris.net',
  'http://kolby.net',
  'http://aracely.com',
  'http://justyn.org',
];

const mockNames = [
  'Priya Brantley',
  'Tomas MacGinnis',
  'Osiris Meszaros',
  'Newell Corkery',
  'Sif Leitzke',
  'Garfield Schulist ',
  'Julianne Osinski ',
];

const mockAvatarUrls = [
  'https://s3.amazonaws.com/uifaces/faces/twitter/magugzbrand2d/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/jonathansimmons/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/megdraws/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/vickyshits/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/ainsleywagon/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/xamorep/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/shoaib253/128.jpg',
  'https://s3.amazonaws.com/uifaces/faces/twitter/jefffis/128.jpg',
];

const getMockCompanyName = () => pickRandom(mockCompanyNames);
const getMockUrl = () => pickRandom(mockUrls);
const getMockAvatarUrl = () => pickRandom(mockAvatarUrls);
const getMockName = () => pickRandom(mockNames);

const getMockCatchPhrase = () => pickRandom(mockCatchPhrases);

export function randomJiraIconUrl() {
  const urls = [
    'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype',
    'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype',
  ];

  return pickRandom(urls);
}

export function randomConfluenceIconUrl() {
  const urls = [
    'https://home-static.us-east-1.prod.public.atl-paas.net/confluence-page-icon.svg',
    'https://home-static.us-east-1.prod.public.atl-paas.net/confluence-blogpost-icon.svg',
  ];

  return pickRandom(urls);
}

function randomPresenceState() {
  const states = ['online', 'offline', 'busy'];
  return pickRandom(states) as 'online' | 'offline' | 'busy';
}

export const getPersonAvatarUrl = (identity: string) =>
  `http://api.adorable.io/avatar/32/${identity}`;
export const getContainerAvatarUrl = (idx: number) =>
  `http://lorempixel.com/32/32/nature/${idx}`;

function randomProduct() {
  const products = ['jira', 'confluence'];
  return pickRandom(products);
}

function randomIssueKey() {
  const keys = ['ETH', 'XRP', 'ADA', 'TRON', 'DOGE'];
  return `${pickRandom(keys)}-${Math.floor(Math.random() * 1001)}`;
}

export function objectData(n: number): ObjectResultProps[] {
  const items: ObjectResultProps[] = [];

  for (let i = 0; i < n; i++) {
    const provider = randomProduct();

    const iconUrl =
      provider === 'jira' ? randomJiraIconUrl() : randomConfluenceIconUrl();

    items.push({
      resultId: uuid(),
      type: 'object',
      name: getMockCatchPhrase(),
      containerName: getMockCompanyName(),
      avatarUrl: iconUrl,
      href: getMockUrl(),
      objectKey: randomIssueKey(),
    });
  }

  return items;
}

export function containerData(n: number): ContainerResultProps[] {
  const items: ContainerResultProps[] = [];

  for (let i = 0; i < n; i++) {
    items.push({
      resultId: uuid(),
      type: 'container',
      name: getMockCompanyName(),
      avatarUrl: getContainerAvatarUrl(i),
    });
  }

  return items;
}

export function personData(n: number): PersonResultProps[] {
  const items: PersonResultProps[] = [];

  for (let i = 0; i < n; i++) {
    items.push({
      resultId: uuid(),
      type: 'person',
      name: getMockName(),
      avatarUrl: getMockAvatarUrl(),
      presenceState: randomPresenceState(),
    });
  }

  return items;
}

export function makeAutocompleteData(): string[] {
  const tokensPerPhrase: string[][] = mockCatchPhrases.map(phrase =>
    phrase.split(/\W+/),
  );
  const tokens = tokensPerPhrase
    .reduce((acc, val) => acc.concat(val), [])
    .map(token => token.toLowerCase());
  return [...new Set(tokens)];
}
