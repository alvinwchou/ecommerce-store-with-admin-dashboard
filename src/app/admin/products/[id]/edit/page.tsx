import { doc, getDoc } from "firebase/firestore";
import { PageHeader } from "../../../_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";
import { db } from "@/app/firebase";

interface Product {
  id: string;
  name: string;
  pricePaidInCents: number;
  filePath: string;
  imagePath: string;
  description: string;
  isAvailableForPurchase: boolean;
}

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const productRef = doc(db, "Product", `${id}`);
  const productSnapshot = await getDoc(productRef);

  let product: Product | null = null;

  const productData = productSnapshot.data();

  if (productData) {
    product = {
      id: id,
      name: productData.name,
      pricePaidInCents: productData.pricePaidInCents,
      filePath: productData.filePath,
      imagePath: productData.imagePath,
      description: productData.description,
      isAvailableForPurchase: productData.isAvailableForPurchase,
    };
  }

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm productData={product} />
    </>
  );
}
