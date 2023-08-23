/* eslint-disable no-console */

import { performance } from 'perf_hooks';

import { parseFile, writeToPath } from 'fast-csv';

import { JastBuilder } from '../src';

import { QueryPerformance, QueryRecord } from './types';

const builder = new JastBuilder();

function processQuery(query: string): QueryPerformance {
  console.log(`Processing query: ${query}`);

  const validQuery = query
    .replace(/\?/g, '"?"')
    .replace(/cf\[[^\]]*]/g, 'cf[1]');

  const t0 = performance.now();
  builder.build(validQuery);
  const t1 = performance.now();

  console.log(`Result ${t1 - t0}`);

  return {
    jql: query,
    milliseconds: t1 - t0,
  };
}

function writeCsv(queriesWithPerformance: QueryPerformance[]) {
  console.log(
    `Writing results in csv file: ${__dirname}/output/performance.csv`,
  );

  writeToPath(`${__dirname}/output/performance.csv`, queriesWithPerformance, {
    headers: true,
  }).on('error', error => console.error(error));
}

const queriesWithPerformance: QueryPerformance[] = [];

console.log(`Parsing input file in ${__dirname}/input/valid-queries.csv`);
parseFile(`${__dirname}/input/valid-queries.csv`, { headers: true })
  .on('error', error => console.error(error))
  .on('data', (record: QueryRecord) =>
    queriesWithPerformance.push(processQuery(record.jql)),
  )
  .on('end', () => writeCsv(queriesWithPerformance));
