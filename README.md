# MeshStack Auth Action

This action authenticates to meshStack API.

### Overview

This GitHub Action is designed to authenticate against the Meshfed API. It helps you obtain an access token using client credentials, which can then be used to interact with the Meshfed API securely. This action simplifies the process of obtaining and managing authentication tokens for your workflows.

### API Documentation

For more information about the Meshfed API, please refer to the [Meshfed API Documentation](https://docs.meshcloud.io/api/index.html).


### Inputs

- `base_url` (required): meshStack API endpoint.
- `client_id` (required): The client ID for the API.
- `key_secret` (required): The key secret for the API.

### Outputs

- `token_file`: Path to the file containing the authentication token


### Example Usage

```yaml
- name: Setup meshStack bbrun
  id: setup-meshstack-auth
  uses: meshcloud/actions-register-source@main
  with:
    base_url: ${{ vars.BUILDINGBLOCK_API_BASE_URL }}
    client_id: ${{ vars.BUILDINGBLOCK_API_CLIENT_ID }}
    key_secret: ${{ secrets.BUILDINGBLOCK_API_KEY_SECRET }}
```
