import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const { isAuthed, user } = useAuth();

  if (isAuthed) {
    const isAdmin = user?.role?.toLowerCase() === "admin";
    return <Navigate to={isAdmin ? "/admin" : "/browse"} replace />;
  }

  return (
    <div className={styles.page}>
      {/* Top nav */}
      <header className={styles.topNav}>
        <div className={styles.brandGroup}>
          <span className={styles.brand}>Lost &amp; Found Network</span>
          <span className={styles.brandSub}>George Brown Polytechnic</span>
        </div>
        <div className={styles.navActions}>
          <Link to="/login" className={styles.navLogin}>Sign In</Link>
          <Link to="/register" className={styles.navRegister}>Register</Link>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>George Brown Polytechnic</p>
          <h1 className={styles.heroTitle}>
            The campus lost and found,<br />
            <span className={styles.heroAccent}>now in one place.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Lost items at George Brown are currently spread across security desks,
            departmental offices, and library service points. This system brings
            everything together — report, browse, and claim belongings without
            making calls or visiting multiple locations.
          </p>
          <div className={styles.heroActions}>
            <Link to="/register" className={styles.primaryBtn}>Create an Account</Link>
            <Link to="/login" className={styles.secondaryBtn}>Sign In</Link>
          </div>
        </div>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </section>

      {/* Problem / Context strip */}
      <section className={styles.contextStrip}>
        <div className={styles.contextInner}>
          <p className={styles.contextText}>
            Students, faculty, and staff across St. James, Casa Loma, and Waterfront campuses
            can now report and recover lost items through a single, searchable platform.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>How it works</h2>

          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>Report an item</h3>
                <p className={styles.stepText}>
                  Found something on campus? Lost your belongings? Submit a report with a
                  description, the location, and an optional photo — takes under a minute.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>Browse listings</h3>
                <p className={styles.stepText}>
                  Search all reported items by category, campus location, date, or status.
                  No need to call security or walk to multiple offices.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>Submit a claim</h3>
                <p className={styles.stepText}>
                  Recognise your item? Submit a claim with a description of how you know it's yours.
                  The Lost &amp; Found team reviews and approves the return.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className={styles.audienceSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Who it's for</h2>
          <div className={styles.audienceGrid}>
            <div className={styles.audienceCard}>
              <h4 className={styles.audienceTitle}>Students</h4>
              <p className={styles.audienceText}>
                Report lost items like phones, wallets, or textbooks and get notified
                if they're found. Browse and claim found items without visiting a security desk.
              </p>
            </div>
            <div className={styles.audienceCard}>
              <h4 className={styles.audienceTitle}>Faculty &amp; Staff</h4>
              <p className={styles.audienceText}>
                Quickly report items found in classrooms, offices, or shared spaces.
                Manage your own listings and handle handovers without paperwork.
              </p>
            </div>
            <div className={styles.audienceCard}>
              <h4 className={styles.audienceTitle}>Lost &amp; Found Office</h4>
              <p className={styles.audienceText}>
                Review and approve claims through the admin dashboard. Manage all
                listings across campuses and resolve disputes in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Get started with your George Brown account</h2>
          <p className={styles.ctaText}>
            Register using any email address. No George Brown login required.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/register" className={styles.ctaBtn}>Create an Account</Link>
            <Link to="/login" className={styles.ctaBtnSecondary}>Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Lost &amp; Found Network — George Brown Polytechnic</span>
        <div className={styles.footerLinks}>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </footer>
    </div>
  );
}
