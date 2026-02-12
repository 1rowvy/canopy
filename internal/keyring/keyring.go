package keyring

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/zalando/go-keyring"
)

const (
	service = "canopy"
	user    = "github-token"
)

// tokenFilePath returns the path to the token file (fallback)
func tokenFilePath() (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	configDir := filepath.Join(homeDir, ".canopy")
	if err := os.MkdirAll(configDir, 0700); err != nil {
		return "", err
	}
	return filepath.Join(configDir, ".token"), nil
}

// SaveGitHubToken saves the GitHub token to the system keyring (with file fallback)
func SaveGitHubToken(token string) error {
	// Try system keyring first
	err := keyring.Set(service, user, token)
	if err == nil {
		return nil
	}

	// Fallback to file storage if keyring fails (e.g., no secret service on Linux)
	path, fileErr := tokenFilePath()
	if fileErr != nil {
		return fmt.Errorf("keyring failed and cannot use file fallback: %w (keyring error: %v)", fileErr, err)
	}

	if writeErr := os.WriteFile(path, []byte(token), 0600); writeErr != nil {
		return fmt.Errorf("failed to save token to file: %w (keyring error: %v)", writeErr, err)
	}

	return nil
}

// GetGitHubToken retrieves the GitHub token from the system keyring (with file fallback)
func GetGitHubToken() (string, error) {
	// Try system keyring first
	token, err := keyring.Get(service, user)
	if err == nil {
		return token, nil
	}

	if err != keyring.ErrNotFound {
		// Real error, try fallback
	}

	// Fallback to file storage
	path, fileErr := tokenFilePath()
	if fileErr != nil {
		return "", nil // No token available
	}

	cleanPath := filepath.Clean(path)

	data, readErr := os.ReadFile(cleanPath)
	if readErr != nil {
		if os.IsNotExist(readErr) {
			return "", nil // No token
		}
		return "", fmt.Errorf("failed to read token file: %w", readErr)
	}

	return string(data), nil
}

// DeleteGitHubToken removes the GitHub token from the system keyring (with file fallback)
func DeleteGitHubToken() error {
	// Try system keyring first
	err := keyring.Delete(service, user)
	if err != nil && err != keyring.ErrNotFound {
		// Non-critical error, continue to file deletion
	}

	// Also delete file fallback
	path, fileErr := tokenFilePath()
	if fileErr != nil {
		return nil // Nothing to delete
	}

	if removeErr := os.Remove(path); removeErr != nil && !os.IsNotExist(removeErr) {
		return fmt.Errorf("failed to delete token file: %w", removeErr)
	}

	return nil
}
