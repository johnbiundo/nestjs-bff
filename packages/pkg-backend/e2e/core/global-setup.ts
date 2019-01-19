import { INestjsBffConfig, NestjsBffConfig } from '../../src/config/nestjs-bff.config';
import { getLogger } from '../../src/shared/logging/logging.shared.module';
import { setupTestDataJwtTokens } from '../core/test-object-literals.constants';
import { setupAuth } from './global-setup-auth';
import { setupDB } from './global-setup-db';

//
// Primary global setup function
//
export const globalSetup = async (globalConfig: any, nestJsBffConfig?: INestjsBffConfig) => {
  // Setup
  nestJsBffConfig = nestJsBffConfig || NestjsBffConfig;
  // @ts-ignore
  global.nestjs_bff = { nestJsBffConfig };

  const logger = getLogger();

  logger.trace('Global Setup Start', Date.now().toString());

  // catch and highlight any unhandled exceptions
  process
    .on('unhandledRejection', (reason, p) => {
      console.error(reason, '-------------------------------------- Unhandled Rejection at Promise!!!!!!!!!!!!', p);
    })
    .on('uncaughtException', err => {
      console.error(err, '----------------------------------------- Uncaught Exception thrown!!!!!!!!!!!!!!');
    });

  // setup DB
  await setupDB(globalConfig, nestJsBffConfig);

  // setup test data literals
  await setupTestDataJwtTokens(nestJsBffConfig);

  // add test users and auth
  await setupAuth(globalConfig, nestJsBffConfig);

  logger.trace('Global Setup End');
};
