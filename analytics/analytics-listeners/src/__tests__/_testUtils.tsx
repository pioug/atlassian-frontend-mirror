import { AnalyticsContext } from '@atlaskit/analytics-next';
import React from 'react';
import Logger, { LOG_LEVEL } from '../helpers/logger';

export const createLoggerMock = (): Logger =>
  ({
    logLevel: LOG_LEVEL.DEBUG,
    logMessage: jest.fn(),
    setLogLevel: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as Logger);

export const createAnalyticsContexts = (contexts: any[]) => ({
  children,
}: {
  children: React.ReactNode;
}) =>
  contexts
    .slice(0)
    .reverse()
    .reduce(
      (prev, curr) => <AnalyticsContext data={curr}>{prev}</AnalyticsContext>,
      children,
    );
