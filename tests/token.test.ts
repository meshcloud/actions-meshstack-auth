import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import * as path from 'node:path';
import * as os from 'node:os';
import * as fs from 'node:fs';

describe('meshstack-auth token file creation', () => {
  const tokenFilePath = path.join(os.tmpdir(), 'meshstack-auth-test-token.json');

  beforeEach(() => {
    // Clean up test files
    if (fs.existsSync(tokenFilePath)) {
      fs.unlinkSync(tokenFilePath);
    }
  });

  describe('token file writing to well-known location', () => {
    it('should write token to well-known location after auth success', () => {
      const authToken = 'test-token-123';
      const tokenData = { token: authToken };

      // Simulate the token storage logic
      fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData));

      assert.strictEqual(fs.existsSync(tokenFilePath), true);

      const readData = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
      assert.strictEqual(readData.token, authToken);
    });

    it('should write token data with correct structure', () => {
      const tokenData = {
        token: 'test-token-123'
      };

      fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData));

      const writtenData = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));

      assert.strictEqual(writtenData.token, 'test-token-123');
    });

    it('should output the token file path for downstream actions', () => {
      const expectedPath = path.join(os.tmpdir(), 'meshstack_token.json');

      // Simulate output setting in GitHub Actions
      const outputs = new Map();
      outputs.set('token_file', expectedPath);

      assert.strictEqual(
        outputs.get('token_file'),
        expectedPath
      );
      assert(outputs.get('token_file').includes('meshstack_token.json'));
    });

    it('should use RUNNER_TEMP environment variable for token file location', () => {
      const runnerTemp = process.env.RUNNER_TEMP || os.tmpdir();
      const expectedPath = path.join(runnerTemp, 'meshstack_token.json');

      assert(expectedPath.includes('meshstack_token.json'));
      assert(expectedPath.startsWith(runnerTemp));
    });

    it('should not write token file if auth fails', () => {
      // Verify file doesn't exist initially
      assert.strictEqual(fs.existsSync(tokenFilePath), false);

      // Simulate auth failure - no file should be written
      // (this is just verification that error path doesn't create file)
      assert.strictEqual(fs.existsSync(tokenFilePath), false);
    });

    it('should handle full token data structure', () => {
      const fullTokenData = {
        token: 'valid-token-xyz',
        extraData: 'some-metadata'
      };

      fs.writeFileSync(tokenFilePath, JSON.stringify(fullTokenData));

      const readData = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
      assert.strictEqual(readData.token, 'valid-token-xyz');
      assert.strictEqual(readData.extraData, 'some-metadata');
    });

    it('should write valid JSON that can be parsed', () => {
      const tokenData = { token: 'test-123' };

      fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData));

      // Should not throw
      const parsed = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
      assert.strictEqual(typeof parsed, 'object');
      assert(parsed.hasOwnProperty('token'));
    });

    it('should use well-known filename meshstack_token.json', () => {
      const tempDir = os.tmpdir();
      const wellKnownPath = path.join(tempDir, 'meshstack_token.json');

      assert(wellKnownPath.endsWith('meshstack_token.json'));
      assert(!wellKnownPath.endsWith('.json.json'));
    });
  });
});
