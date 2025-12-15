import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerId: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  customerName: String,
  email: { type: String, required: true },
  phone: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'United States' },
  address: String,
  orderId: String,
  orderDate: { type: Date, default: Date.now },
  product: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  unitPrice: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['Pending', 'In progress', 'Completed'], default: 'Pending' },
  createdBy: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
