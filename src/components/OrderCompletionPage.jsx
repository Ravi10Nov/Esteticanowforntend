import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const OrderCompletionPage = () => {
  const [loader, setLoader] = useState(false);
  const [appointment, setAppointment] = useState(null);

  const user = useSelector((store) => store.user?.user);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!user) return;

      setLoader(true);

      try {
        const createRes = await axios.post(
          "http://localhost:7777/appointment/createAppointment",
          {},
          { withCredentials: true }
        );

        const appointmentId = createRes.data.appointment._id;

        // Then fetch appointment details
        const res = await axios.get(
          `http://localhost:7777/appointment/getAppointment/${appointmentId}`,
          { withCredentials: true }
        );

        setAppointment(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoader(false);
      }
    };

    fetchAppointment();
  }, [user]);

  if (loader || !appointment)
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#10b981" size={80} />
      </div>
    );

  const items = appointment.appointment.cart.items;
  const totals = appointment.totals;

  return (
    <>
      <div className="p-6 transition-all duration-300">
        <h2 className="text-xl font-semibold mb-1 ml-4 bg-transparent">
          Order Completion
        </h2>
        <p className="text-sm font-semibold mb-1 ml-4 bg-transparent">
          Booking Summary - {appointment.appointment.appointmentId}
        </p>
      </div>

      <div className="bg-blue-50 p-6 flex flex-col lg:flex-row gap-6">

        <div className="flex-1 bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Products Used</h3>
          {items.map((p) => (
            <div
              key={p.product._id}
              className="flex justify-between border-b py-2 text-gray-700 items-center"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.product.image}
                  alt={p.product.name}
                  className="w-14 h-14 object-contain rounded border"
                />
                <div>
                  <p className="font-medium text-sm">{p.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {p.quantity} | Unit: ₹{p.product.price}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{p.product.price * p.quantity}</p>
              </div>
            </div>
          ))}
        </div>


        <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Billing Summary</h3>
          <div className="flex justify-between py-1">
            <span>Service Total</span>
            <span>₹{totals.serviceTotal}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Product Total</span>
            <span>₹{totals.productTotal}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Order Discount</span>
            <span>₹{totals.discount}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Tax (18%)</span>
            <span>₹{totals.tax}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Final Total</span>
            <span>₹{totals.finalTotal}</span>
          </div>
          <button className="mt-6 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600">
            Complete Payment
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderCompletionPage;
