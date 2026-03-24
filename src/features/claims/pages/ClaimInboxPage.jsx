import PageContainer from "../../../components/ui/PageContainer";
import ClaimStatusPill from "../components/ClaimStatusPill";

export default function ClaimInboxPage() {
  const claims = [
    {
      id: 1,
      item_title: "Black Wallet",
      claimant_name: "John Doe",
      submitted_at: "2026-03-20",
      status: "Pending",
      verification_details: "Described wallet contents and card holder color.",
    },
    {
      id: 2,
      item_title: "Silver iPhone",
      claimant_name: "Sarah Lee",
      submitted_at: "2026-03-18",
      status: "Approved",
      verification_details: "Matched lock screen photo and phone case details.",
    },
    {
      id: 3,
      item_title: "Blue Backpack",
      claimant_name: "Michael Chen",
      submitted_at: "2026-03-16",
      status: "Rejected",
      verification_details: "Claim details did not match the item description.",
    },
  ];

  return (
    <PageContainer>
      <div className="page-header">
        <h1>Claims Inbox</h1>
        <p>Review incoming claims submitted for your found items.</p>
      </div>

      {claims.length === 0 ? (
        <div className="empty-state">
          <p>No incoming claims yet.</p>
        </div>
      ) : (
        <div className="claims-list">
          {claims.map((claim) => (
            <div key={claim.id} className="claim-card">
              <div className="claim-card-header">
                <div>
                  <h2>{claim.item_title}</h2>
                  <p>
                    <strong>Claimant:</strong> {claim.claimant_name}
                  </p>
                </div>
                <ClaimStatusPill status={claim.status} />
              </div>

              <div className="claim-card-body">
                <p>
                  <strong>Submitted:</strong> {claim.submitted_at}
                </p>
                <p>
                  <strong>Verification Details:</strong> {claim.verification_details}
                </p>
              </div>

              <div className="claim-card-actions">
                <button type="button" className="primary-button" disabled>
                  Review Page Coming Soon
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}