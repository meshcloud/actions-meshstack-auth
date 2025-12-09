# meshStack Auth Action

This GitHub Action authenticates to the meshStack API to enable building block automation workflows.

## Overview

This GitHub Action is designed to authenticate against the meshStack API. It helps you obtain an access token using client credentials, which can then be used to interact with the meshStack API securely. This action simplifies the process of obtaining and managing authentication tokens for your workflows.

## Related Actions

This action is part of a suite of GitHub Actions for meshStack building block automation:

- **[actions-meshstack-auth](https://github.com/meshcloud/actions-meshstack-auth)** (this action) - Authenticates to the meshStack API
- **[actions-register-source](https://github.com/meshcloud/actions-register-source)** - Registers building block sources and steps with meshStack
- **[actions-send-status](https://github.com/meshcloud/actions-send-status)** - Sends building block step status updates to meshStack

## Documentation

For more information about meshStack building blocks and GitHub Actions integration, refer to:
- [meshStack GitHub Actions Integration](https://docs.meshcloud.io/integrations/github/github-actions/)
- [meshStack API Documentation](https://docs.meshcloud.io/api/index.html)

## Inputs

- `base_url` (required): meshStack API endpoint.
- `client_id` (required): The client ID for the API.
- `key_secret` (required): The key secret for the API.

### Outputs

- `token_file`: Path to the file containing the authentication token

## Example Usage

```yaml
- name: Setup meshStack bbrun
  id: setup-meshstack-auth
  uses: meshcloud/actions-meshstack-auth@v0.0.1
  with:
    base_url: ${{ vars.BUILDINGBLOCK_API_BASE_URL }}
    client_id: ${{ vars.BUILDINGBLOCK_API_CLIENT_ID }}
    key_secret: ${{ secrets.BUILDINGBLOCK_API_KEY_SECRET }}
```
