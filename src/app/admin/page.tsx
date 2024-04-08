import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "../firebase";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
  collection,
  count,
  getAggregateFromServer,
  getCountFromServer,
  query,
  sum,
  where,
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
  // create a reference to order
  const orderRef = collection(db, "Order");
  // get the total number of sales and sum of sales
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
  // create a reference to user and order
  const userRef = collection(db, "User");
  const orderRef = collection(db, "User");
  // grab the information from db
  const [userSnapshot, orderSnapshot] = await Promise.all([
    getCountFromServer(userRef),
    getAggregateFromServer(orderRef, {
      amount: sum("pricePaidInCents"),
    }),
  ]);

  // get total user count and total sales
  const userCount = userSnapshot.data().count;
  const amount = orderSnapshot.data().amount;

  // return total user count and average sale per user
  return {
    userCount,
    averageValuePerUser: userCount === 0 ? 0 : (amount || 0) / userCount / 100,
  };
}

async function getProductData() {
  // create a reference to product
  const productRef = collection(db, "Product");

  const [activeSnapshot, inactiveSnapshot] = await Promise.all([
    getCountFromServer(
      query(productRef, where("isAvailableForPurchase", "==", true))
    ),
    getCountFromServer(
      query(productRef, where("isAvailableForPurchase", "==", false))
    ),
  ]);

  // get total amount of product (active and inactive)
  const activeCount = activeSnapshot.data().count;
  const inactiveCount = inactiveSnapshot.data().count;

  return { activeCount, inactiveCount };
}

export default async function AdminDashboard() {
  // const salesData = await getSalesData();
  // const userData = await getUserData();
  // const productData = await getProductData();
  // make all the calls in parallel
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

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
