import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: "Aspirin", stock: 20, expiration: "2023-12-01", price: 5 },
    { id: 2, name: "Ibuprofen", stock: 5, expiration: "2023-11-15", price: 10 },
    { id: 3, name: "Paracetamol", stock: 50, expiration: "2024-01-10", price: 8 },
  ]);

  const [prescriptions, setPrescriptions] = useState([]);
  const [newPrescription, setNewPrescription] = useState({ patientName: "", drug: "", dosage: "" });
  const [drugInteractions, setDrugInteractions] = useState([]);
  const [sales, setSales] = useState([]);
  const [newSale, setNewSale] = useState({ drug: "", quantity: 1 });

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

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPrescription = () => {
    setPrescriptions((prev) => [...prev, newPrescription]);
    setNewPrescription({ patientName: "", drug: "", dosage: "" });
    checkDrugInteractions(newPrescription.drug);
  };

  const checkDrugInteractions = (drug) => {
    const interactions = ["Aspirin", "Ibuprofen"].includes(drug)
      ? ["Interaction with Aspirin", "Interaction with Ibuprofen"]
      : [];
    setDrugInteractions(interactions);
    interactions.forEach((interaction) => toast(interaction));
  };

  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSale = () => {
    const drug = inventory.find((item) => item.name === newSale.drug);
    if (drug && drug.stock >= newSale.quantity) {
      setSales((prev) => [...prev, { ...newSale, price: drug.price * newSale.quantity }]);
      setInventory((prev) =>
        prev.map((item) =>
          item.name === newSale.drug ? { ...item, stock: item.stock - newSale.quantity } : item
        )
      );
      setNewSale({ drug: "", quantity: 1 });
    } else {
      toast(`Insufficient stock for ${newSale.drug}`);
    }
  };

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
              <p>Price: ${item.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl text-center mb-4">Prescription Processing</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add Prescription</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Prescription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                name="patientName"
                value={newPrescription.patientName}
                onChange={handlePrescriptionChange}
              />
            </div>
            <div>
              <Label htmlFor="drug">Drug</Label>
              <Select
                id="drug"
                name="drug"
                value={newPrescription.drug}
                onValueChange={(value) => setNewPrescription((prev) => ({ ...prev, drug: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a drug" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                name="dosage"
                value={newPrescription.dosage}
                onChange={handlePrescriptionChange}
              />
            </div>
            <Button onClick={handleAddPrescription}>Add Prescription</Button>
          </div>
        </DialogContent>
      </Dialog>

      <h2 className="text-2xl text-center mb-4">Prescriptions</h2>
      <div className="space-y-4">
        {prescriptions.map((prescription, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{prescription.patientName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Drug: {prescription.drug}</p>
              <p>Dosage: {prescription.dosage}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl text-center mb-4">Drug Interactions</h2>
      <div className="space-y-4">
        {drugInteractions.map((interaction, index) => (
          <Alert key={index}>
            <AlertTitle>Interaction Alert</AlertTitle>
            <AlertDescription>{interaction}</AlertDescription>
          </Alert>
        ))}
      </div>

      <h2 className="text-2xl text-center mb-4">Sales Processing</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add Sale</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="drug">Drug</Label>
              <Select
                id="drug"
                name="drug"
                value={newSale.drug}
                onValueChange={(value) => setNewSale((prev) => ({ ...prev, drug: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a drug" />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={newSale.quantity}
                onChange={handleSaleChange}
              />
            </div>
            <Button onClick={handleAddSale}>Add Sale</Button>
          </div>
        </DialogContent>
      </Dialog>

      <h2 className="text-2xl text-center mb-4">Sales</h2>
      <div className="space-y-4">
        {sales.map((sale, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{sale.drug}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Quantity: {sale.quantity}</p>
              <p>Total Price: ${sale.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;