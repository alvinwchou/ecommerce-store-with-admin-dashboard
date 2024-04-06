import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { collection, getDocs } from "firebase/firestore";
import db from "@/app/firebase";
import { CheckCircle2, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";

interface Product {
  id: string;
  name: string;
  pricePaidInCents: number;
  isAvailableForPurchase: boolean;
  orderCount: number;
}

export default function AdminProductPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
}

async function ProductsTable() {
  // create a reference to the Product database
  const productRef = collection(db, "Product");
  const productsSnapshot = await getDocs(productRef);

  const products: Product[] = [];

  productsSnapshot.forEach((doc) => {
    const productData = doc.data();

    if (productData) {
      // create a new object
      const product: Product = {
        id: doc.id,
        name: productData.name,
        pricePaidInCents: productData.pricePaidInCents,
        isAvailableForPurchase: productData.isAvailableForPurchase,
        orderCount: productData.order?.length() || 0,
      };

      // push it to products
      products.push(product);
    }
  });

  // return message if no products found
  if (products.length === 0) return <p>No products found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailableForPurchase ? (
                <>
                  <CheckCircle2 />
                  <span className="sr-only">Available</span>
                </>
              ) : (
                <>
                  <XCircle />
                  <span className="sr-only">Unavailable</span>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
