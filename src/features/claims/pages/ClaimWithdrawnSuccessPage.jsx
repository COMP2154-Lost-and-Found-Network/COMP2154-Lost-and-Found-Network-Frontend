import { Link } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import styles from "../styles/claimWithdrawnSuccessPage.module.css";

export default function ClaimWithdrawnSuccessPage() {
  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.icon}>✓</div>
          <h1 className={styles.title}>Claim Withdrawn</h1>
          <p className={styles.text}>
            Success — you have withdrawn this claim!
          </p>

          <div className={styles.actions}>
            <Link to="/claims" className={styles.primaryBtn}>
              Back to My Claims
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
