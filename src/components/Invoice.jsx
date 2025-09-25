import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { API_URL } from "../../src/config";

const Invoice = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoader(true);
        const res = await axios.get(
          `${API_URL}/invoice/getInvoice/${invoiceId}`
        );
        setInvoice(res.data.invoice);
      } catch (err) {
        console.error("Failed to fetch invoice:", err);
      } finally {
        setLoader(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  if (loader || !invoice)
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#10b981" size={80} />
      </div>
    );

  const items = invoice.appointment.cart.items;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Invoice {invoice.invoiceNumber}
      </h1>
      <p>Date: {new Date(invoice.createdAt).toLocaleString()}</p>
      <p>Appointment ID: {invoice.appointment.appointmentId}</p>

      <table className="w-full border mt-4">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Unit Price</th>
            <th className="p-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it._id} className="border-b">
              <td className="p-2">{it.product.name}</td>
              <td className="p-2 text-right">{it.quantity}</td>
              <td className="p-2 text-right">₹{it.product.price}</td>
              <td className="p-2 text-right">
                ₹{it.product.price * it.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <p>Subtotal: ₹{invoice.totalAmount}</p>
        <p>Tax: ₹{invoice.tax}</p>
        <p>Discount: ₹{invoice.discount}</p>
        <p className="font-bold text-lg">Grand Total: ₹{invoice.grandTotal}</p>
      </div>
    </div>
  );
};

export default Invoice;

