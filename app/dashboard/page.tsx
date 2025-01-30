
"use client";

import { useEffect, useState } from "react";
// import ProtectedRoute from "@/components/ProtectedRoute";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import ProtectedRoute from "../components/ProtectedRoute";

// Define an interface for the order data
interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  total: number;
  discount: number;
  orderDate: string;
  status: string;
  cartItems: { name: string; image: string }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id,
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          zipCode,
          total,
          discount,
          orderDate,
          status,
          cartItems[]->{
            name,
            image
          }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

      const handleLogout = () => {
            localStorage.removeItem("isLoggedIn"); // Remove login status
            window.location.href = "/admin"; // Redirect to login page
          };

  return (
    <ProtectedRoute>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-full lg:w-1/5 bg-blue-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">
            Admin Panel
          </h2>
          <ul className="space-y-4">
            <li
              className={`cursor-pointer ${
                filter === "All"
                  ? "font-bold bg-white p-5 transition-all rounded-lg text-black"
                  : "p-5 transition-all"
              }`}
              onClick={() => setFilter("All")}
            >
              All Orders
            </li>
            <li
              className={`cursor-pointer ${
                filter === "pending"
                  ? "font-bold bg-white p-5 transition-all rounded-lg text-black"
                  : "p-5 transition-all"
              }`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </li>
            <li
              className={`cursor-pointer ${
                filter === "dispatch"
                  ? "font-bold bg-white p-5 transition-all rounded-lg text-black"
                  : "p-5 transition-all"
              }`}
              onClick={() => setFilter("dispatch")}
            >
              Dispatch
            </li>
            <li
              className={`cursor-pointer ${
                filter === "success"
                  ? "font-bold bg-white p-5 transition-all rounded-lg text-black"
                  : "p-5 transition-all"
              }`}
              onClick={() => setFilter("success")}
            >
              Completed
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-center lg:text-left">
            Orders
          </h2>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4">{order._id}</td>
                    <td className="px-6 py-4">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="px-6 py-4">{order.address}</td>
                    <td className="px-6 py-4">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">${order.total}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          order.status === "Pending"
                            ? "bg-yellow-200"
                            : order.status === "Completed"
                            ? "bg-green-200"
                            : "bg-blue-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-600">View</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Details */}
          {selectedOrder && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Order Details - {selectedOrder._id}
              </h3>
              <p>
                <strong>Customer:</strong> {selectedOrder.firstName}{" "}
                {selectedOrder.lastName}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.address},{" "}
                {selectedOrder.city}, {selectedOrder.zipCode}
              </p>
              <p>
                <strong>Total:</strong> ${selectedOrder.total}
              </p>
              <ul>
                <strong>Products:</strong>
                {selectedOrder.cartItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {item.name}
                    {item.image && (
                      <Image
                        src={urlFor(item.image).url()}
                        width={40}
                        height={40}
                        alt={item.name}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
      </div>
    </ProtectedRoute>
  );
}
