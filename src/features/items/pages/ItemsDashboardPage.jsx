import PageContainer from "../../../components/ui/PageContainer";
import useItems from "../hooks/useItems";
import ItemCard from "../components/ItemCard";
import styles from "../styles/itemsDashboard.module.css";

export default function ItemsDashboardPage() {
  const { items, isLoading, error } = useItems();

  function softDelete(id) {
    alert(`Soft delete ${id}`);
  }

  return (
    <PageContainer>
      <h1 className={styles.title}>Items Dashboard</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onSoftDelete={softDelete}
          />
        ))}
      </div>
    </PageContainer>
  );
}