/**
 * These imports are written out explicitly because they
 * need to be statically analyzable to be uploaded to CodeSandbox correctly.
 */
import Alexander from './images/Alexander.svg';
import Aliza from './images/Aliza.svg';
import Alvin from './images/Alvin.svg';
import Angie from './images/Angie.svg';
import Arjun from './images/Arjun.svg';
import Blair from './images/Blair.svg';
import Claudia from './images/Claudia.svg';
import Colin from './images/Colin.svg';
import Ed from './images/Ed.svg';
import Effie from './images/Effie.svg';
import Eliot from './images/Eliot.svg';
import Fabian from './images/Fabian.svg';
import Gael from './images/Gael.svg';
import Gerard from './images/Gerard.svg';
import Hasan from './images/Hasan.svg';
import Helena from './images/Helena.svg';
import Ivan from './images/Ivan.svg';
import Katina from './images/Katina.svg';
import Lara from './images/Lara.svg';
import Leo from './images/Leo.svg';
import Lydia from './images/Lydia.svg';
import Maribel from './images/Maribel.svg';
import Milo from './images/Milo.svg';
import Myra from './images/Myra.svg';
import Narul from './images/Narul.svg';
import Norah from './images/Norah.svg';
import Oliver from './images/Oliver.svg';
import Rahul from './images/Rahul.svg';
import Renato from './images/Renato.svg';
import Steve from './images/Steve.svg';
import Tanya from './images/Tanya.svg';
import Tori from './images/Tori.svg';
import Vania from './images/Vania.svg';

export type Item = {
  name: string;
  role: string;
  avatarUrl: string;
  itemId: string;
};

const avatarMap: Record<string, string> = {
  Alexander,
  Aliza,
  Alvin,
  Angie,
  Arjun,
  Blair,
  Claudia,
  Colin,
  Ed,
  Effie,
  Eliot,
  Fabian,
  Gael,
  Gerard,
  Hasan,
  Helena,
  Ivan,
  Katina,
  Lara,
  Leo,
  Lydia,
  Maribel,
  Milo,
  Myra,
  Narul,
  Norah,
  Oliver,
  Rahul,
  Renato,
  Steve,
  Tanya,
  Tori,
  Vania,
};

function getItem({ name, role }: { name: string; role: string }): Item {
  return {
    name,
    role,
    avatarUrl: avatarMap[name],
    itemId: name,
  };
}

export const confluenceTeam: Item[] = [
  { name: 'Alexander', role: 'Product Manager' },
  { name: 'Arjun', role: 'Software Engineer' },
  { name: 'Ed', role: 'Software Engineer' },
  { name: 'Gael', role: 'Engineering Manager' },
  { name: 'Ivan', role: 'Content Designer' },
  { name: 'Lydia', role: 'Design Manager' },
  { name: 'Narul', role: 'Product Manager' },
  { name: 'Renato', role: 'Principal Engineer' },
  { name: 'Vania', role: 'Lead Designer' },
  { name: 'Angie', role: 'Senior Engineer' },
  { name: 'Colin', role: 'Software Engineer' },
  { name: 'Fabian', role: 'Senior Designer' },
].map(getItem);

export const jiraTeam: Item[] = [
  { name: 'Helena', role: 'Design Researcher' },
  { name: 'Leo', role: 'Content Designer' },
  { name: 'Myra', role: 'Engineering Manager' },
  { name: 'Rahul', role: 'Product Manager' },
  { name: 'Tori', role: 'Senior Designer' },
  { name: 'Alvin', role: 'Senior Engineer' },
  { name: 'Claudia', role: 'Senior Engineer' },
  { name: 'Eliot', role: 'Lead Designer' },
].map(getItem);

export const trelloTeam: Item[] = [
  { name: 'Hasan', role: 'Designer' },
  { name: 'Lara', role: 'Design Researcher' },
  { name: 'Milo', role: 'Product Manager' },
  { name: 'Oliver', role: 'Senior Designer' },
  { name: 'Tanya', role: 'Engineering Manager' },
  { name: 'Aliza', role: 'Design Manager' },
  { name: 'Blair', role: 'Program Manager' },
  { name: 'Effie', role: 'Senior Engineer' },
  { name: 'Gerard', role: 'Design Manager' },
  { name: 'Katina', role: 'Program Manager' },
].map(getItem);

export type ColumnType = {
  title: string;
  columnId: string;
  items: Item[];
};
export type ColumnMap = { [columnId: string]: ColumnType };

export function getInitialData() {
  const columnMap: ColumnMap = {
    confluence: {
      title: 'Confluence',
      columnId: 'confluence',
      items: confluenceTeam,
    },
    jira: {
      title: 'Jira',
      columnId: 'jira',
      items: jiraTeam,
    },
    trello: {
      title: 'Trello',
      columnId: 'trello',
      items: trelloTeam,
    },
  };

  const orderedColumnIds = ['confluence', 'jira', 'trello'];

  return {
    columnMap,
    orderedColumnIds,
  };
}
