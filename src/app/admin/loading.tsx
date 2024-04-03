import { Loader2 } from "lucide-react";

// for next js not to cashe our admin pages
export const dynamic = "force-dynamic";

export default function AdminLoading() {
  return (
    <div className="flex justify-center">
      <Loader2 className="size-24 animate-spin" />
    </div>
  );
}
