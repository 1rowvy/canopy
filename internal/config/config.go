package config

import (
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

// Config represents the application configuration
type Config struct {
	GitHub GitHubConfig `yaml:"github"`
	Repos  []RepoConfig `yaml:"repos"`
}

// GitHubConfig holds GitHub-specific settings
type GitHubConfig struct {
	Token string `yaml:"token"`
}

// RepoConfig represents a repository to track
type RepoConfig struct {
	Owner string `yaml:"owner"`
	Name  string `yaml:"name"`
}

// DefaultConfigPath returns the default configuration file path
func DefaultConfigPath() (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("failed to get home directory: %w", err)
	}
	return filepath.Join(homeDir, ".canopy", "config.yaml"), nil
}

// Load reads and parses the configuration file
func Load(path string) (*Config, error) {
	cleanPath := filepath.Clean(path)

	data, err := os.ReadFile(cleanPath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, fmt.Errorf("config file not found: %s", path)
		}
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, fmt.Errorf("failed to parse config: %w", err)
	}

	return &cfg, nil
}

// Save writes the configuration to a file
func Save(path string, cfg *Config) error {
	// Ensure directory exists
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0700); err != nil {
		return fmt.Errorf("failed to create config directory: %w", err)
	}

	data, err := yaml.Marshal(cfg)
	if err != nil {
		return fmt.Errorf("failed to marshal config: %w", err)
	}

	if err := os.WriteFile(path, data, 0600); err != nil {
		return fmt.Errorf("failed to write config file: %w", err)
	}

	return nil
}

// LoadOrDefault loads config or returns default if not found
func LoadOrDefault(path string) *Config {
	cfg, err := Load(path)
	if err != nil {
		return &Config{
			GitHub: GitHubConfig{},
			Repos:  []RepoConfig{},
		}
	}
	return cfg
}
