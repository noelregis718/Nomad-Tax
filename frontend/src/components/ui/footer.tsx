import { Button } from "@/components/ui/button"
import * as React from "react"

interface FooterProps {
  logo: React.ReactNode
  brandName: string
  tagline?: string
  socialLinks: Array<{
    icon: React.ReactNode
    href: string
    label: string
  }>
  mainLinks: Array<{
    href: string
    label: string
  }>
  legalLinks: Array<{
    href: string
    label: string
  }>
  copyright: {
    text: string
    license?: string
  }
}

export function Footer({
  logo,
  brandName,
  tagline = "The intelligence layer for global tax compliance and cross-border residency tracking.",
  socialLinks,
  mainLinks,
  legalLinks,
  copyright,
}: FooterProps) {
  return (
    <footer className="modern-footer">
      <div className="landing-container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="/" className="footer-logo-link">
              {logo}
              <span className="footer-brand-name">{brandName}</span>
            </a>
            <p className="footer-tagline">{tagline}</p>
          </div>

          <div className="footer-nav-grid">
            <div className="footer-nav-group">
              <h4>Platform</h4>
              <ul className="footer-nav-list">
                {mainLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="footer-nav-group">
              <h4>Legal</h4>
              <ul className="footer-nav-list">
                {legalLinks.map((link, i) => (
                  <li key={i}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <div className="font-bold text-slate-900">{copyright.text}</div>
            {copyright.license && <div className="mt-1">{copyright.license}</div>}
          </div>

          <ul className="footer-social-list">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <a 
                  href={link.href} 
                  className="footer-social-btn" 
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
