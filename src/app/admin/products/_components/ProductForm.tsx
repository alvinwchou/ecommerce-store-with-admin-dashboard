"use client";

import db from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { doc, setDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";

interface Product {
  name: string;
  pricePaidInCents: number;
  description: string;
  filePath: string;
  imagePath: string;
}

export function ProductForm() {
  const [priceInCents, setPriceInCents] = useState<number>();
  const [product, setProduct] = useState<Product>({
    name: "",
    pricePaidInCents: 0,
    description: "",
    filePath: "",
    imagePath: "",
  });

  async function addProduct() {
    await setDoc(doc(db, "Product", crypto.randomUUID()), {
      name: product.name,
      pricePaidInCents: product.pricePaidInCents,
      description: product.description,
      filePath: product.filePath,
      imagePath: product.imagePath,
      isAvailableForPurchase: false,
      createdAt: new Date(),
    });

    redirect("/admin/products");
  }

  return (
    <form action={addProduct} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          value={product.name}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="text"
          id="priceInCents"
          name="priceInCents"
          required
          onChange={(e) =>
            setProduct({ ...product, pricePaidInCents: Number(e.target.value) })
          }
          value={product.pricePaidInCents}
        />
      </div>
      <div className="text-muted-foreground">
        {formatCurrency(product.pricePaidInCents / 100)}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          value={product.description}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          type="file"
          id="file"
          name="file"
          required
          onChange={(e) => setProduct({ ...product, filePath: e.target.value })}
          value={product.filePath}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          required
          onChange={(e) =>
            setProduct({ ...product, imagePath: e.target.value })
          }
          value={product.imagePath}
        />
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}