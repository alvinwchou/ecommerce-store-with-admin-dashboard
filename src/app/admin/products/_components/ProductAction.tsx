"use client";

import db from "@/app/firebase";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

async function toggleProductAvailability({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) {
  const productRef = doc(db, "Product", `${id}`);
  await updateDoc(productRef, {
    isAvailableForPurchase: isAvailableForPurchase,
  });
}

async function deleteProduct(id: string) {
  const productRef = doc(db, "Product", `${id}`);
  await deleteDoc(productRef);
}

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability({
            id,
            isAvailableForPurchase: !isAvailableForPurchase,
          });
          router.refresh();
          console.log("available");
        });
      }}
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

export function DeleteDropdownItem({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      // disable is being passed in to make sure we are not able to delete product if we have orders
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct(id);
          router.refresh();
          console.log("deleted");
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
