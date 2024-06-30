import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const Index = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: "Aspirin", stock: 20, expiration: "2023-12-01" },
    { id: 2, name: "Ibuprofen", stock: 5, expiration: "2023-11-15" },
    { id: 3, name: "Paracetamol", stock: 50, expiration: "2024-01-10" },
  ]);

  useEffect(() => {
    inventory.forEach((item) => {
      if (item.stock < 10) {
        toast(`Low stock alert: ${item.name}`);
      }
      if (new Date(item.expiration) < new Date()) {
        toast(`Expiration alert: ${item.name} has expired`);
      }
    });
  }, [inventory]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl text-center mb-4">Inventory Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Stock: {item.stock}</p>
              <p>Expiration Date: {item.expiration}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;