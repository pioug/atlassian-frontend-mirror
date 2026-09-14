import { tester } from '../../../__tests__/utils/_tester';
import rule, { exceptions } from '../index';

tester.run('no-native-embed-bridge-query-param-literals', rule, exceptions);
