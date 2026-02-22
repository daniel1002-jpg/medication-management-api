import { jest }  from '@jest/globals';

process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'clinical_cases_test_db';

jest.setTimeout(10000); // 10 segundos

afterEach(() => {
    jest.clearAllMocks();
});