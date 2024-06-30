import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// AI Dosage Recommendation Function
const recommendDosage = (patientData, medication) => {
  // Example logic for dosage recommendation
  const { age, weight, medicalHistory } = patientData;
  let dosage = 0;

  if (medication === "Aspirin") {
    dosage = weight * 0.1; // Example: 0.1 mg per kg of body weight
  } else if (medication === "Ibuprofen") {
    dosage = weight * 0.2; // Example: 0.2 mg per kg of body weight
  } else if (medication === "Paracetamol") {
    dosage = weight * 0.15; // Example: 0.15 mg per kg of body weight
  }

  // Adjust dosage based on age and medical history
  if (age > 65) {
    dosage *= 0.8; // Reduce dosage for elderly patients
  }
  if (medicalHistory.includes("Kidney Disease")) {
    dosage *= 0.7; // Further reduce dosage for patients with kidney disease
  }

  return dosage.toFixed(2); // Return dosage rounded to 2 decimal places
};

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
  const [patients, setPatients] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [newPatient, setNewPatient] = useState({ patientName: "", patientAge: "", patientGender: "", medicalHistory: "" });
  const [newMedication, setNewMedication] = useState({ patient: "", medication: "", dosage: "" });

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
    const patient = patients.find((p) => p.patientName === newPrescription.patientName);
    if (patient) {
      const recommendedDosage = recommendDosage(patient, newPrescription.drug);
      setNewPrescription((prev) => ({ ...prev, dosage: recommendedDosage }));
    }
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

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = () => {
    setPatients((prev) => [...prev, { ...newPatient, id: patients.length + 1 }]);
    setNewPatient({ patientName: "", patientAge: "", patientGender: "", medicalHistory: "" });
  };

  const handleMedicationChange = (e) => {
    const { name, value } = e.target;
    setNewMedication((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedication = () => {
    setMedicationHistory((prev) => [...prev, { ...newMedication, id: medicationHistory.length + 1 }]);
    setNewMedication({ patient: "", medication: "", dosage: "" });
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
              <Select
                id="patientName"
                name="patientName"
                value={newPrescription.patientName}
                onValueChange={(value) => setNewPrescription((prev) => ({ ...prev, patientName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.patientName}>
                      {patient.patientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      <h2 className="text-2xl text-center mb-4">Patient Profiles</h2>
      <div className="space-y-4">
        {patients.map((patient) => (
          <Card key={patient.id}>
            <CardHeader>
              <CardTitle>{patient.patientName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Age: {patient.patientAge}</p>
              <p>Gender: {patient.patientGender}</p>
              <p>Medical History: {patient.medicalHistory}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add Patient</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                name="patientName"
                value={newPatient.patientName}
                onChange={handlePatientChange}
              />
            </div>
            <div>
              <Label htmlFor="patientAge">Age</Label>
              <Input
                id="patientAge"
                name="patientAge"
                type="number"
                value={newPatient.patientAge}
                onChange={handlePatientChange}
              />
            </div>
            <div>
              <Label htmlFor="patientGender">Gender</Label>
              <Select
                id="patientGender"
                name="patientGender"
                value={newPatient.patientGender}
                onValueChange={(value) => setNewPatient((prev) => ({ ...prev, patientGender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Input
                id="medicalHistory"
                name="medicalHistory"
                value={newPatient.medicalHistory}
                onChange={handlePatientChange}
              />
            </div>
            <Button onClick={handleAddPatient}>Add Patient</Button>
          </div>
        </DialogContent>
      </Dialog>

      <h2 className="text-2xl text-center mb-4">Medication History</h2>
      <div className="space-y-4">
        {medicationHistory.map((medication) => (
          <Card key={medication.id}>
            <CardHeader>
              <CardTitle>{medication.patient}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Medication: {medication.medication}</p>
              <p>Dosage: {medication.dosage}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add Medication</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Medication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patient">Patient</Label>
              <Select
                id="patient"
                name="patient"
                value={newMedication.patient}
                onValueChange={(value) => setNewMedication((prev) => ({ ...prev, patient: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.patientName}>
                      {patient.patientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="medication">Medication</Label>
              <Input
                id="medication"
                name="medication"
                value={newMedication.medication}
                onChange={handleMedicationChange}
              />
            </div>
            <div>
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                name="dosage"
                value={newMedication.dosage}
                onChange={handleMedicationChange}
              />
            </div>
            <Button onClick={handleAddMedication}>Add Medication</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;