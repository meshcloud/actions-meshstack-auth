import * as core from '@actions/core';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { logAxiosError, isAxiosError } from './error-utils';

export interface AuthInputs {
  client_id: string;
  key_secret: string;
  base_url: string;
}

// allows stubbing @actions/core in tests
export interface CoreAdapter {
  getInput: (name: string) => string;
  setOutput: (name: string, value: any) => void;
  setFailed: (message: string) => void;
  debug: (message: string) => void;
  info: (message: string) => void;
  error: (message: string) => void;
}

export async function runAuth(coreAdapter: CoreAdapter = core) {
  try {
    const clientId = coreAdapter.getInput('client_id');
    const keySecret = coreAdapter.getInput('key_secret');
    const baseUrl = coreAdapter.getInput('base_url');

    coreAdapter.debug(`Client ID: ${clientId}`);
    coreAdapter.debug(`Key Secret: ${keySecret}`);
    coreAdapter.debug(`Base URL: ${baseUrl}`);

    // Authenticate and get the token
    try {
      const authResponse = await axios.post(
        `${baseUrl}/api/login`,
        `grant_type=client_credentials&client_id=${clientId}&client_secret=${keySecret}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          maxRedirects: 5 // Follow redirects
        }
      );

      const token = authResponse.data.access_token;
      coreAdapter.debug(`Token: ${token}`);

      // Write token and other variables to a temporary file
      const tempDir = process.env.RUNNER_TEMP || os.tmpdir();
      const tokenFilePath = path.join(tempDir, 'meshstack_token.json');
      const tokenData = {
        token,
        baseUrl,
      };
      fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData));
      coreAdapter.debug(`Token file path: ${tokenFilePath}`);

      // Indicate successful login
      coreAdapter.info('Login was successful.');
      
      // Output the token file path
      coreAdapter.setOutput('token_file', tokenFilePath);

      // Read token from the file
      const fileTokenData = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
      const fileToken = fileTokenData.token;

    } catch (authError) {
      if (isAxiosError(authError)) {
        logAxiosError(authError, coreAdapter, 'Authentication error');
      } else {
        coreAdapter.error(`Unexpected error: ${authError}`);
      }
      throw authError;
    }
  } catch (error) {
    // Exception handler of last resort
    if (error instanceof Error) {
      coreAdapter.setFailed(error.message);
    } else {
      coreAdapter.setFailed(`An unknown error occurred: ${error}`);
    }
    throw error;
  }
}

async function run() {
  try {
    await runAuth(core);
  } catch (error) {
    // Last-resort exception handler: prevent unhandled rejections
    // The error has already been logged and setFailed has been called
    process.exit(1);
  }
}

// Only run if this file is executed directly (not imported)
if (require.main === module) {
  run();
}

