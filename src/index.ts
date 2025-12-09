import * as core from '@actions/core';
import * as github from '@actions/github';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

async function run() {
  try {
    const clientId = core.getInput('client_id');
    const keySecret = core.getInput('key_secret');
    const baseUrl = core.getInput('base_url');

    core.debug(`Client ID: ${clientId}`);
    core.debug(`Key Secret: ${keySecret}`);
    core.debug(`Base URL: ${baseUrl}`);

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
      core.debug(`Token: ${token}`);

      // Write token and other variables to a temporary file
      const tempDir = process.env.RUNNER_TEMP || os.tmpdir();
      const tokenFilePath = path.join(tempDir, 'meshstack_token.json');
      const tokenData = {
        token,
        baseUrl,
      };
      fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData));
      core.debug(`Token file path: ${tokenFilePath}`);

      // Indicate successful login
      core.info('Login was successful.');
      
      // Output the token file path
      core.setOutput('token_file', tokenFilePath);

      // Read token from the file
      const fileTokenData = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
      const fileToken = fileTokenData.token;

    } catch (authError) {
      if (axios.isAxiosError(authError)) {
        if (authError.response) {
          core.error(`Authentication error response: ${JSON.stringify(authError.response.data)}`);
          core.error(`Status code: ${authError.response.status}`);
        } else {
          core.error(`Authentication error message: ${authError.message}`);
        }
      } else {
        core.error(`Unexpected error: ${authError}`);
      }
      throw authError;
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

run();

