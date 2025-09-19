import type { Bip } from "@shared/schema";

export interface TimelineEvent {
  date: string;
  type: 'created' | 'status_change' | 'major_revision' | 'author_change' | 'file_rename';
  title: string;
  author: string;
  commit_sha: string;
  message?: string;
  additions?: number;
  deletions?: number;
  files_changed?: number;
}

export interface BipTimeline {
  bipNumber: number;
  events: TimelineEvent[];
  firstCommit: string;
  lastUpdated: string;
  totalCommits: number;
}

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author?: {
    login: string;
    avatar_url: string;
  };
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  files?: Array<{
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
  }>;
}

const GITHUB_API_BASE = "https://api.github.com/repos/bitcoin/bips";

// GitHub API headers with authentication if token is available
function getGitHubHeaders() {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'BIPExplorer/1.0'
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

export class GitHubTimelineService {
  private cache = new Map<number, BipTimeline>();
  private cacheTimestamp = new Map<number, number>();
  private readonly CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

  /**
   * Fetch commit history for a specific BIP file
   */
  async fetchCommitHistory(bipNumber: number): Promise<BipTimeline> {
    const now = Date.now();
    const cached = this.cache.get(bipNumber);
    const cacheTime = this.cacheTimestamp.get(bipNumber) || 0;

    if (cached && (now - cacheTime) < this.CACHE_DURATION) {
      return cached;
    }

    try {
      const bipFilename = `bip-${bipNumber.toString().padStart(4, '0')}.mediawiki`;
      const bipFilenameAlt = `bip-${bipNumber}.mediawiki`;
      const bipFilenameMd = `bip-${bipNumber.toString().padStart(4, '0')}.md`;
      const bipFilenameAltMd = `bip-${bipNumber}.md`;

      let commits: GitHubCommit[] = [];
      let actualFilename = '';

      // Try different filename formats
      for (const filename of [bipFilename, bipFilenameAlt, bipFilenameMd, bipFilenameAltMd]) {
        try {
          const response = await fetch(
            `${GITHUB_API_BASE}/commits?path=${filename}&per_page=100`,
            {
              headers: getGitHubHeaders()
            }
          );

          if (response.ok) {
            commits = await response.json();
            actualFilename = filename;
            break;
          }
        } catch (error) {
          // Continue to next filename variant
          continue;
        }
      }

      if (commits.length === 0) {
        throw new Error(`No commits found for BIP ${bipNumber}`);
      }

      // Fetch detailed commit information for major commits
      const detailedCommits = await this.fetchDetailedCommits(commits.slice(0, 10));
      
      // Build timeline events
      const events = this.buildTimelineEvents(detailedCommits, bipNumber, actualFilename);
      
      const timeline: BipTimeline = {
        bipNumber,
        events: events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        firstCommit: commits[commits.length - 1]?.sha || '',
        lastUpdated: commits[0]?.commit.author.date || '',
        totalCommits: commits.length
      };

      // Cache the result
      this.cache.set(bipNumber, timeline);
      this.cacheTimestamp.set(bipNumber, now);

      return timeline;
    } catch (error) {
      console.error(`Error fetching timeline for BIP ${bipNumber}:`, error);
      
      // Return empty timeline on error
      const emptyTimeline: BipTimeline = {
        bipNumber,
        events: [],
        firstCommit: '',
        lastUpdated: '',
        totalCommits: 0
      };
      
      return emptyTimeline;
    }
  }

  /**
   * Fetch detailed commit information including stats
   */
  private async fetchDetailedCommits(commits: GitHubCommit[]): Promise<GitHubCommit[]> {
    const detailedCommits: GitHubCommit[] = [];
    
    for (const commit of commits) {
      try {
        const response = await fetch(
          `${GITHUB_API_BASE}/commits/${commit.sha}`,
          {
            headers: getGitHubHeaders()
          }
        );

        if (response.ok) {
          const detailedCommit = await response.json();
          detailedCommits.push(detailedCommit);
        } else {
          // Fallback to basic commit info
          detailedCommits.push(commit);
        }
        
        // Rate limit protection
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        // Fallback to basic commit info
        detailedCommits.push(commit);
      }
    }

    return detailedCommits;
  }

  /**
   * Build timeline events from commits
   */
  private buildTimelineEvents(commits: GitHubCommit[], bipNumber: number, filename: string): TimelineEvent[] {
    const events: TimelineEvent[] = [];
    
    if (commits.length === 0) return events;

    // First commit (creation)
    const firstCommit = commits[commits.length - 1];
    events.push({
      date: firstCommit.commit.author.date,
      type: 'created',
      title: `BIP-${bipNumber} Initial Draft`,
      author: firstCommit.author?.login || firstCommit.commit.author.name,
      commit_sha: firstCommit.sha,
      message: firstCommit.commit.message
    });

    // Process commits to identify significant events
    for (let i = commits.length - 2; i >= 0; i--) {
      const commit = commits[i];
      const message = commit.commit.message.toLowerCase();
      const stats = commit.stats;
      const author = commit.author?.login || commit.commit.author.name;

      // Check for status changes
      if (this.isStatusChangeCommit(message)) {
        const statusType = this.extractStatusFromMessage(message);
        events.push({
          date: commit.commit.author.date,
          type: 'status_change',
          title: `Status changed to ${statusType}`,
          author,
          commit_sha: commit.sha,
          message: commit.commit.message,
          additions: stats?.additions,
          deletions: stats?.deletions
        });
      }
      
      // Check for major revisions (large changes)
      else if (stats && (stats.additions + stats.deletions) > 100) {
        events.push({
          date: commit.commit.author.date,
          type: 'major_revision',
          title: `Major revision (${stats.additions + stats.deletions} changes)`,
          author,
          commit_sha: commit.sha,
          message: commit.commit.message,
          additions: stats.additions,
          deletions: stats.deletions,
          files_changed: commit.files?.length || 1
        });
      }
      
      // Check for file renames
      else if (commit.files?.some(file => file.status === 'renamed')) {
        events.push({
          date: commit.commit.author.date,
          type: 'file_rename',
          title: 'File renamed or moved',
          author,
          commit_sha: commit.sha,
          message: commit.commit.message
        });
      }
    }

    return events;
  }

  /**
   * Check if commit message indicates a status change
   */
  private isStatusChangeCommit(message: string): boolean {
    const statusKeywords = [
      'final', 'active', 'draft', 'rejected', 'withdrawn',
      'obsolete', 'replaced', 'proposed', 'accepted'
    ];
    
    return statusKeywords.some(keyword => 
      message.includes(`to ${keyword}`) || 
      message.includes(`mark ${keyword}`) ||
      message.includes(`status ${keyword}`) ||
      message.includes(`${keyword} status`)
    );
  }

  /**
   * Extract status type from commit message
   */
  private extractStatusFromMessage(message: string): string {
    const statusWords = ['final', 'active', 'draft', 'rejected', 'withdrawn', 'obsolete', 'replaced', 'proposed', 'accepted'];
    
    for (const status of statusWords) {
      if (message.includes(status)) {
        return status.charAt(0).toUpperCase() + status.slice(1);
      }
    }
    
    return 'Updated';
  }

  /**
   * Clear cache for a specific BIP or all BIPs
   */
  clearCache(bipNumber?: number): void {
    if (bipNumber) {
      this.cache.delete(bipNumber);
      this.cacheTimestamp.delete(bipNumber);
    } else {
      this.cache.clear();
      this.cacheTimestamp.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; oldestEntry: number | null } {
    const timestamps = Array.from(this.cacheTimestamp.values());
    return {
      size: this.cache.size,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : null
    };
  }
}

// Singleton instance
export const githubTimelineService = new GitHubTimelineService();