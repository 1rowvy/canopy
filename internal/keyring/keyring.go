package keyring

import (
	"fmt"

	"github.com/zalando/go-keyring"
)

const (
	service = "canopy"
	user    = "github-token"
)

// SaveGitHubToken saves the GitHub token to the system keyring
func SaveGitHubToken(token string) error {
	if err := keyring.Set(service, user, token); err != nil {
		return fmt.Errorf("failed to save token: %w", err)
	}
	return nil
}

// GetGitHubToken retrieves the GitHub token from the system keyring
func GetGitHubToken() (string, error) {
	token, err := keyring.Get(service, user)
	if err != nil {
		if err == keyring.ErrNotFound {
			return "", nil
		}
		return "", fmt.Errorf("failed to get token: %w", err)
	}
	return token, nil
}

// DeleteGitHubToken removes the GitHub token from the system keyring
func DeleteGitHubToken() error {
	if err := keyring.Delete(service, user); err != nil {
		if err == keyring.ErrNotFound {
			return nil
		}
		return fmt.Errorf("failed to delete token: %w", err)
	}
	return nil
}
