import { db, storage } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  // get the product data
  const productRef = doc(db, "Product", `${id}`);
  const productSnapshot = await getDoc(productRef);

  const productData = productSnapshot.data();

  const url = await getDownloadURL(ref(storage, productData?.filePath));

  return NextResponse.redirect(new URL(url))
}
