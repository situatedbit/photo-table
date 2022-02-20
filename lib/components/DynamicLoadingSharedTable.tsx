import SharedTable from "@/components/SharedTable";
import { useSharedTable } from "@/models/doc";

interface Props {
  tableId: string;
}

export default function DynamicLoadingSharedTable({ tableId }: Props) {
  const { loading, doc, table } = useSharedTable(tableId);
  const loadingComponent = <div>Loading…</div>;

  return loading ? loadingComponent : <SharedTable doc={doc} table={table} />;
}
