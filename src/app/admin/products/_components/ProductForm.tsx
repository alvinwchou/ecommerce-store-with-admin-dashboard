"use client";

import { db, storage } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

interface Product {
  id: string;
  name: string;
  pricePaidInCents: number;
  file?: File | null;
  filePath: string;
  image?: File | null;
  imagePath: string;
  description: string;
  isAvailableForPurchase: boolean;
}

export function ProductForm({ productData }: { productData?: Product | null }) {
  const [product, setProduct] = useState<Product>({
    id: productData ? productData.id : "",
    name: productData ? productData.name : "",
    pricePaidInCents: productData ? productData.pricePaidInCents : 0,
    description: productData ? productData.description : "",
    filePath: productData ? productData.filePath : "",
    imagePath: productData ? productData.imagePath : "",
    isAvailableForPurchase: productData
      ? productData.isAvailableForPurchase
      : false,
  });

  // const [error, action] = useFormState(product == null ? addProduct : updateProduct.bind(null, product.id), {})
  const [error, action] = useFormState( addProduct, {})
  const router = useRouter();

  async function addProduct() {
    // create file path
    const file = `product/${crypto.randomUUID()}-${product.file?.name}`;
    if (product.file) {
      // create reference to full path
      const fileRef = ref(storage, file);
      // upload the file
      await uploadBytes(fileRef, product.file);
    }

    // create image path
    const image = `images/${crypto.randomUUID()}-${product.image?.name}`;
    if (product.image) {
      // create reference to full path
      const imageRef = ref(storage, image);
      // upload the image
      await uploadBytes(imageRef, product.image);
    }

    await setDoc(doc(db, "Product", crypto.randomUUID()), {
      name: product.name,
      pricePaidInCents: product.pricePaidInCents,
      description: product.description,
      filePath: file,
      imagePath: image,
      isAvailableForPurchase: false,
      createdAt: new Date(),
    });
    redirect("/admin/products");
  }

  async function updateProduct(id: string) {
    // if user is updating the file we have to remove and add a the new one

    let newFilePath = product.filePath
    console.log(product.file, product.file?.size)
    // if (product.file && product.file.size) {
    //   //remove the old file
    //   const oldFileRef = ref(storage, product.filePath);
    //   // await deleteObject(oldFileRef);

    //   // create new file path
    //   const file = `product/${product.file?.name}-${crypto.randomUUID()}`;
    //   // create reference to full path
    //   const fileRef = ref(storage, file);
    //   // upload the new file
    //   // await uploadBytes(fileRef, product.file);
      

    //   newFilePath = file;
    // }

    let newImagePath = product.imagePath
    // if (product.image && product.image.size) {
    //   // remove the old image
    //   const oldImageRef = ref(storage, product.imagePath);
    //   await deleteObject(oldImageRef);

    //   // create new image path
    //   const image = `images/${product.image?.name}-${crypto.randomUUID()}`;
    //   // create reference to full path
    //   const imageRef = ref(storage, image);
    //   // upload the new image
    //   await uploadBytes(imageRef, product.image);

    //   newImagePath = image;
    // }

    await updateDoc(doc(db, "Product", id), {
      name: product.name,
      pricePaidInCents: product.pricePaidInCents,
      description: product.description,
      filePath: newFilePath,
      imagePath: newImagePath,
      isAvailableForPurchase: product.isAvailableForPurchase,
      updatedAt: new Date(),
    });
    redirect("/admin/products");
  }

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name}
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
          defaultValue={product?.description}
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
          // only required if we are adding new product, because when we edit we do not want to force user to pass in a new file
          required={product == null}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];
              setProduct({ ...product, file: file });
            }
          }}
        />
        {product != null && (
          <div className="text-muted-foreground">{product.filePath}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          // only required if we are adding new product, because when we edit we do not want to force user to pass in a new file
          required={product == null}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];
              setProduct({ ...product, image: file });
            }
          }}
        />
        {/* {product.imagePath != "" && <Image src= width="400" height="400" alt="Product Image"/>} */}
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
