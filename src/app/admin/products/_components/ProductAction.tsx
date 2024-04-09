"use client";

import { db, storage } from "@/app/firebase";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
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
          // get the product data
          const productRef = doc(db, "Product", `${id}`);
          const productSnapshot = await getDoc(productRef);
          const productData = productSnapshot.data();

          //remove file from db
          const oldFileRef = ref(storage, productData?.filePath);
          await deleteObject(oldFileRef);

          //remove image from db
          const oldImageRef = ref(storage, productData?.imagePath);
          await deleteObject(oldImageRef);

          // remove product from db
          await deleteProduct(id);
          router.refresh();
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
