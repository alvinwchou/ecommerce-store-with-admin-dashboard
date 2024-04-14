import { db } from "@/app/firebase";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
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

async function getProducts() {
    const q = query(
        collection(db, "Product"),
        where("isAvailableForPurchase", "==", true),
        orderBy("name", "asc"),
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

export default function ProductsPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductsSuspense />
        </Suspense>
      </div>
    )
}

async function ProductsSuspense() {
    const products = await getProducts()
    return products.map(product => (
        <ProductCard key={product.id} {...product} />
    ))
}