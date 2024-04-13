import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Suspense } from "react";

interface Product {
  id: string;
  name: string;
  pricePaidInCents: number;
  // filePath: string;
  imagePath: string;
  description: string;
  isAvailableForPurchase: boolean;
  // createdAt: Date;
  // updatedAt: Date;
  // orders: Order[];
}

async function getMostPopularProducts() {
  const q = query(
    collection(db, "Product"),
    where("isAvailableForPurchase", "==", true),
    // orderBy("orders", "desc"),
    limit(6)
  );
  const querySnapshot = await getDocs(q);

  const products: Product[] = [];

  querySnapshot.forEach((doc) => {
    const productData = doc.data();

    if (productData) {
      //   create a new object
      const product: Product = {
        id: doc.id,
        name: productData.name,
        pricePaidInCents: productData.pricePaidInCents,
        isAvailableForPurchase: productData.isAvailableForPurchase,
        imagePath: productData.imagePath,
        description: productData.description,
      };

      // push it to products
      products.push(product);
    }
  });
  console.log(products);
  return products;
}

async function getNewestProducts() {
  const q = query(
    collection(db, "Product"),
    where("isAvailableForPurchase", "==", true),
    orderBy("createdAt", "desc"),
    limit(6)
  );
  const querySnapshot = await getDocs(q);

  const products: Product[] = [];

  querySnapshot.forEach((doc) => {
    const productData = doc.data();

    if (productData) {
      //   create a new object
      const product: Product = {
        id: doc.id,
        name: productData.name,
        pricePaidInCents: productData.pricePaidInCents,
        isAvailableForPurchase: productData.isAvailableForPurchase,
        imagePath: productData.imagePath,
        description: productData.description,
      };

      // push it to products
      products.push(product);
    }
  });
  return products;
}

export default function HomePage() {
  getMostPopularProducts();
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Most Popular"
        productsFetcher={getMostPopularProducts}
      />
      <ProductGridSection title="Newest" productsFetcher={getNewestProducts} />
    </main>
  );
}

type ProductGridSectionProps = {
  title: string;
  productsFetcher: () => Promise<Product[]>;
};

function ProductGridSection({
  title,
  productsFetcher,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3x1 font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
