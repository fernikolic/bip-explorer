import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <div className="flex items-center mb-4 cursor-pointer" data-testid="link-footer-home">
                <i className="fab fa-bitcoin text-bitcoin-500 text-2xl mr-2"></i>
                <span className="text-xl font-bold">BIP Explorer</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm">
              Educational resource for Bitcoin Improvement Proposals. 
              Understanding how Bitcoin evolves through community consensus.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" data-testid="link-browse-all">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Browse All BIPs
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/authors" data-testid="link-author-guidelines">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Author Guidelines
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about" data-testid="link-contributing">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Contributing
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/search?type=Standards%20Track" data-testid="link-standards-track">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Standards Track
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/search?type=Informational" data-testid="link-informational">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Informational
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/search?type=Process" data-testid="link-process">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Process
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/search?status=Final" data-testid="link-final-bips">
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Final BIPs
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">External Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="https://github.com/bitcoin/bips" 
                  className="hover:text-white transition-colors flex items-center gap-1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-github-repo"
                >
                  GitHub Repository
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://bitcoincore.org" 
                  className="hover:text-white transition-colors flex items-center gap-1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-bitcoin-core"
                >
                  Bitcoin Core
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://bitcoin.org" 
                  className="hover:text-white transition-colors flex items-center gap-1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-bitcoin-org"
                >
                  Bitcoin.org
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} BIP Explorer. Educational resource for Bitcoin Improvement Proposals.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a 
              href="https://github.com/bitcoin/bips" 
              className="text-muted-foreground hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-social-github"
            >
              <i className="fab fa-github"></i>
            </a>
            <a 
              href="https://twitter.com/bitcoin" 
              className="text-muted-foreground hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-social-twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a 
              href="https://github.com/bitcoin/bips/commits/master.atom" 
              className="text-muted-foreground hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-social-rss"
            >
              <i className="fas fa-rss"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
