import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { getDatabase, onValue, ref } from "firebase/database";
import db from "../firebase";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  collection,
  count,
  doc,
  getAggregateFromServer,
  getDocs,
  query,
  sum,
} from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  pricePaidInCents: number;
  filePath: string;
  imagePath: string;
  description: string;
  isAvailableForPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
  orders: Order[];
}

interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  orders: Order[];
}

type Order = {
  id: string;
  pricePaidInCents: number;
  createdAt: Date;
  updatedAt: Date;

  userId: string;
  productId: string;
};

async function getSalesData() {
  // create a reference to collection
  const orderRef = collection(db, "Order");
  // get the total number of sales and sum of salse
  const snapshot = await getAggregateFromServer(orderRef, {
    amount: sum("pricePaidInCents"),
    numberOfSales: count(),
  });

  return {
    amount: (snapshot.data().amount || 0) / 100,
    numberOfSales: snapshot.data().numberOfSales,
  };
}

async function getUserData() {
  // get total user count and average sales per user

  return { userCount: 0, averageValuePerUser: 0 };
}

async function getProductData() {
  // get total amount of product (active and inactive)

  return { activeCount: 0, inactiveCount: 0 };
}

export default async function AdminDashboard() {
  const salesData = await getSalesData();
  const userData = await getUserData();
  const productData = await getProductData();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(
          userData.averageValuePerUser
        )} Average Value`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
        body={formatNumber(productData.activeCount)}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
