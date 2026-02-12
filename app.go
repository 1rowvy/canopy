package main

import (
	"context"
	"fmt"

	"canopy/internal/config"
	"canopy/internal/keyring"
	"canopy/internal/provider"
)

// App struct
type App struct {
	ctx      context.Context
	provider provider.Provider
	config   *config.Config
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Load config
	configPath, _ := config.DefaultConfigPath()
	a.config = config.LoadOrDefault(configPath)

	// Initialize GitHub provider if token exists
	token, _ := keyring.GetGitHubToken()
	if token != "" {
		ghProvider, err := provider.NewGitHubProvider(token)
		if err == nil {
			a.provider = ghProvider
		}
	}
}

// DashboardData represents the main dashboard summary
type DashboardData struct {
	TotalRepos    int                     `json:"total_repos"`
	OpenPRs       int                     `json:"open_prs"`
	CISuccessRate float64                 `json:"ci_success_rate"`
	RecentRepos   []*provider.Repo        `json:"recent_repos"`
	RecentPRs     []*provider.PullRequest `json:"recent_prs"`
}

// GetDashboardData returns aggregated data for the dashboard
func (a *App) GetDashboardData() (*DashboardData, error) {
	if a.provider == nil {
		return nil, fmt.Errorf("GitHub provider not initialized. Please configure your token.")
	}

	repos, err := a.provider.ListRepos(a.ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch repos: %w", err)
	}

	// Collect all PRs from tracked repos
	var allPRs []*provider.PullRequest
	for _, repo := range repos {
		prs, err := a.provider.ListPullRequests(a.ctx, repo.Owner, repo.Name)
		if err != nil {
			continue // Skip repos with errors
		}
		allPRs = append(allPRs, prs...)
	}

	// Count open PRs
	openPRs := 0
	for _, pr := range allPRs {
		if pr.State == "open" {
			openPRs++
		}
	}

	// Calculate CI success rate (simplified - from recent repos)
	successCount := 0
	totalChecks := 0
	for _, repo := range repos {
		if len(repos) > 5 {
			break // Limit to first 5 repos for performance
		}
		status, err := a.provider.GetCIStatus(a.ctx, repo.Owner, repo.Name, repo.DefaultBranch)
		if err == nil && status.TotalRuns > 0 {
			successCount += status.SuccessRuns
			totalChecks += status.TotalRuns
		}
	}

	successRate := 0.0
	if totalChecks > 0 {
		successRate = float64(successCount) / float64(totalChecks) * 100
	}

	// Limit recent items
	recentRepos := repos
	if len(recentRepos) > 10 {
		recentRepos = recentRepos[:10]
	}

	recentPRs := allPRs
	if len(recentPRs) > 10 {
		recentPRs = recentPRs[:10]
	}

	return &DashboardData{
		TotalRepos:    len(repos),
		OpenPRs:       openPRs,
		CISuccessRate: successRate,
		RecentRepos:   recentRepos,
		RecentPRs:     recentPRs,
	}, nil
}

// GetRepos returns all repositories
func (a *App) GetRepos() ([]*provider.Repo, error) {
	if a.provider == nil {
		return nil, fmt.Errorf("GitHub provider not initialized")
	}
	return a.provider.ListRepos(a.ctx)
}

// GetPullRequests returns PRs for a specific repo
func (a *App) GetPullRequests(owner, repo string) ([]*provider.PullRequest, error) {
	if a.provider == nil {
		return nil, fmt.Errorf("GitHub provider not initialized")
	}
	return a.provider.ListPullRequests(a.ctx, owner, repo)
}

// GetCIStatus returns CI status for a ref
func (a *App) GetCIStatus(owner, repo, ref string) (*provider.CIStatus, error) {
	if a.provider == nil {
		return nil, fmt.Errorf("GitHub provider not initialized")
	}
	return a.provider.GetCIStatus(a.ctx, owner, repo, ref)
}

// SaveGitHubToken saves the GitHub token and reinitializes the provider
func (a *App) SaveGitHubToken(token string) error {
	if token == "" {
		return fmt.Errorf("token cannot be empty")
	}

	// Save to keyring
	if err := keyring.SaveGitHubToken(token); err != nil {
		return fmt.Errorf("failed to save token: %w", err)
	}

	// Initialize provider
	ghProvider, err := provider.NewGitHubProvider(token)
	if err != nil {
		return fmt.Errorf("failed to initialize GitHub provider: %w", err)
	}

	a.provider = ghProvider
	return nil
}

// GetGitHubToken returns whether a token is configured
func (a *App) GetGitHubToken() (bool, error) {
	token, err := keyring.GetGitHubToken()
	if err != nil {
		return false, err
	}
	return token != "", nil
}

// DeleteGitHubToken removes the saved token
func (a *App) DeleteGitHubToken() error {
	if err := keyring.DeleteGitHubToken(); err != nil {
		return err
	}
	a.provider = nil
	return nil
}
