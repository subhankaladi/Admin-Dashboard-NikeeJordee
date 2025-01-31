
// "use client";

// import { useEffect, useState } from "react";
// // import ProtectedRoute from "@/components/ProtectedRoute";
// import { client } from "@/sanity/lib/client";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import ProtectedRoute from "../components/ProtectedRoute";

// // Define an interface for the order data
// interface Order {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   zipCode: string;
//   total: number;
//   discount: number;
//   orderDate: string;
//   status: string;
//   cartItems: { name: string; image: string }[];
// }

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     client
//       .fetch(
//         `*[_type == "order"]{
//           _id,
//           firstName,
//           lastName,
//           phone,
//           email,
//           address,
//           city,
//           zipCode,
//           total,
//           discount,
//           orderDate,
//           status,
//           cartItems[]->{
//             name,
//             image
//           }
//         }`
//       )
//       .then((data) => setOrders(data))
//       .catch((error) => console.error("Error fetching orders:", error));
//   }, []);

//   const filteredOrders =
//     filter === "All"
//       ? orders
//       : orders.filter((order) => order.status === filter);

//       const handleLogout = () => {
//             localStorage.removeItem("isLoggedIn"); // Remove login status
//             window.location.href = "/admin"; // Redirect to login page
//           };

//   return (
//     <ProtectedRoute>
//       <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
//         {/* Sidebar */}
//         <div className="w-full lg:w-1/5 bg-blue-600 text-white p-6">
//           <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">
//             Admin Panel
//           </h2>
//           <ul className="space-y-4">
//             <li
//               className={`cursor-pointer ${
//                 filter === "All"
//                   ? "font-bold bg-white p-5 transition-all rounded-lg text-black"
//                   : "p-5 transition-all"
//               }`}
//               onClick={() => setFilter("All")}
//             >
//               All Orders
//             </li>
//             <li
//               className={`cursor-pointer ${
//                 filter === "pending"
//                   ? "font-bold bg-white p-5 transition-all rounded-lg text-black"
//                   : "p-5 transition-all"
//               }`}
//               onClick={() => setFilter("pending")}
//             >
//               Pending
//             </li>
//             <li
//               className={`cursor-pointer ${
//                 filter === "dispatch"
//                   ? "font-bold bg-white p-5 transition-all rounded-lg text-black"
//                   : "p-5 transition-all"
//               }`}
//               onClick={() => setFilter("dispatch")}
//             >
//               Dispatch
//             </li>
//             <li
//               className={`cursor-pointer ${
//                 filter === "success"
//                   ? "font-bold bg-white p-5 transition-all rounded-lg text-black"
//                   : "p-5 transition-all"
//               }`}
//               onClick={() => setFilter("success")}
//             >
//               Completed
//             </li>
//           </ul>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           <h2 className="text-2xl font-bold mb-4 text-center lg:text-left">
//             Orders
//           </h2>
//           <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//             <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Customer
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Address
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Total
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredOrders.map((order) => (
//                   <tr
//                     key={order._id}
//                     className="cursor-pointer hover:bg-blue-100"
//                     onClick={() => setSelectedOrder(order)}
//                   >
//                     <td className="px-6 py-4">{order._id}</td>
//                     <td className="px-6 py-4">
//                       {order.firstName} {order.lastName}
//                     </td>
//                     <td className="px-6 py-4">{order.address}</td>
//                     <td className="px-6 py-4">
//                       {new Date(order.orderDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4">${order.total}</td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-2 py-1 rounded text-sm ${
//                           order.status === "Pending"
//                             ? "bg-yellow-200"
//                             : order.status === "Completed"
//                             ? "bg-green-200"
//                             : "bg-blue-200"
//                         }`}
//                       >
//                         {order.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-blue-600">View</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Order Details */}
//           {selectedOrder && (
//             <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
//               <h3 className="text-xl font-bold mb-4">
//                 Order Details - {selectedOrder._id}
//               </h3>
//               <p>
//                 <strong>Customer:</strong> {selectedOrder.firstName}{" "}
//                 {selectedOrder.lastName}
//               </p>
//               <p>
//                 <strong>Address:</strong> {selectedOrder.address},{" "}
//                 {selectedOrder.city}, {selectedOrder.zipCode}
//               </p>
//               <p>
//                 <strong>Total:</strong> ${selectedOrder.total}
//               </p>
//               <ul>
//                 <strong>Products:</strong>
//                 {selectedOrder.cartItems.map((item, index) => (
//                   <li key={index} className="flex items-center gap-2">
//                     {item.name}
//                     {item.image && (
//                       <Image
//                         src={urlFor(item.image).url()}
//                         width={40}
//                         height={40}
//                         alt={item.name}
//                       />
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//         <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Logout
//           </button>
//       </div>
//     </ProtectedRoute>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import ProtectedRoute from "../components/ProtectedRoute";
import Swal from "sweetalert2";

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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
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
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // const handleDeleteOrder = (orderId: string) => {
  //   setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
  // };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (!result.isConfirmed) return;  // Agar user ne cancel kiya to return karein
  
    try {
      await client.delete(orderId); // Sanity client se delete karein
      setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId)); // UI update karein
  
      Swal.fire("Deleted!", "Your order has been deleted.", "success"); // Success alert
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error"); // Error alert
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
        <div className="w-full lg:w-1/5 bg-blue-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">Admin Panel</h2>
          <ul className="space-y-4">
            {["All", "pending", "dispatch", "success"].map((status) => (
              <li
                key={status}
                className={`cursor-pointer p-5 transition-all rounded-lg ${
                  filter === status ? "font-bold bg-white text-black" : "text-white"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-center lg:text-left">Orders</h2>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
              <thead className="bg-gray-50">
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <>
                    <tr
                      key={order._id}
                      className="cursor-pointer hover:bg-blue-100"
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <td>{order._id}</td>
                      <td>{order.firstName} {order.lastName}</td>
                      <td>{order.address}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>${order.total}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-gray-100 p-1 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatch">Dispatch</option>
                          <option value="success">Completed</option>
                        </select>
                      </td>
                      {/* <td>
                        <button onClick={() => handleDeleteOrder(order._id)} className="text-red-600">Delete</button>
                      </td> */}
                      <td className="px-6 py-4">
  <button
    onClick={() => handleDelete(order._id)}
    className="bg-red-500 text-white px-3 py-1 rounded"
  >
    Delete
  </button>
</td>

                    </tr>
                    {selectedOrderId === order._id && (
                      <tr>
                        <td colSpan={7} className="bg-gray-50 p-4">
                          <h3 className="font-bold">Order Details</h3>
                          <p><strong>Phone:</strong> {order.phone}</p>
                          <p><strong>Email:</strong> {order.email}</p>
                          <p><strong>City:</strong> {order.city}</p>
                          <ul>
                            {order.cartItems.map((item, index) => (
                              <li key={index} className="flex items-center gap-2">
                                {item.name}
                                {item.image && (
                                  <Image src={urlFor(item.image).url()} width={40} height={40} alt={item.name} />
                                )}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
