// "use client";

// import { useEffect, useState } from "react";
// import { client } from "@/sanity/lib/client";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import Swal from "sweetalert2";
// // import ProtectedRoute from "@/app/components/protectroute/page";
// import React from "react";
// import ProtectedRoute from "../components/ProtectedRoute";

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
//   status: string | null;
//   cartItems: { name: string; image: string }[];
// }

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
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
//     filter === "All" ? orders : orders.filter((order) => order.status === filter);

//   const toggleOrderDetails = (orderId: string) => {
//     setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
//   };

//   const handleStatusChange = (orderId: string, newStatus: string) => {
//     setOrders((prevOrders) =>
//       prevOrders.map((order) =>
//         order._id === orderId ? { ...order, status: newStatus } : order
//       )
//     );
//   };

//   const handleDelete = async (orderId: string) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       await client.delete(orderId);
//       setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
//       Swal.fire("Deleted!", "Your order has been deleted.", "success");
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       Swal.fire("Error!", "Something went wrong while deleting.", "error");
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
//         <div className="w-full lg:w-1/5 bg-blue-600 text-white p-6">
//           <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">Admin Panel</h2>
//           <ul className="space-y-4">
//             {["All", "pending", "dispatch", "success"].map((status) => (
//               <li
//                 key={status}
//                 className={`cursor-pointer p-5 transition-all rounded-lg ${
//                   filter === status ? "font-bold bg-white text-black" : "text-white"
//                 }`}
//                 onClick={() => setFilter(status)}
//               >
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="flex-1 p-6 overflow-y-auto">
//           <h2 className="text-2xl font-bold mb-4 text-center lg:text-left">Orders</h2>
//           <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//             <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th>ID</th>
//                   <th>Customer</th>
//                   <th>Address</th>
//                   <th>Date</th>
//                   <th>Total</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredOrders.map((order) => (
//                   <React.Fragment key={order._id}>
//                     <tr
//                       className="cursor-pointer hover:bg-blue-100"
//                       onClick={() => toggleOrderDetails(order._id)}
//                     >
//                       <td>{order._id}</td>
//                       <td>{order.firstName} {order.lastName}</td>
//                       <td>{order.address}</td>
//                       <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                       <td>${order.total}</td>
//                       <td>
//                         <select
//                           value={order.status || ""}
//                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                           className="bg-gray-100 p-1 rounded"
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="dispatch">Dispatch</option>
//                           <option value="success">Completed</option>
//                         </select>
//                       </td>
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => handleDelete(order._id)}
//                           className="bg-red-500 text-white px-3 py-1 rounded"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                     {selectedOrderId === order._id && (
//                       <tr>
//                         <td colSpan={7} className="bg-gray-50 p-4">
//                           <h3 className="font-bold">Order Details</h3>
//                           <p><strong>Phone:</strong> {order.phone}</p>
//                           <p><strong>Email:</strong> {order.email}</p>
//                           <p><strong>City:</strong> {order.city}</p>
//                           <ul>
//                             {order.cartItems.map((item, index) => (
//                               <li key={`${order._id}-${index}`} className="flex items-center gap-2">
//                                 {item.name}
//                                 {item.image && (
//                                   <Image src={urlFor(item.image).url()} width={40} height={40} alt={item.name} />
//                                 )}
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

// admin-dashboard.tsx

// "use client"

// import React, { useState, useEffect } from 'react';
// import ProtectedRoute from '../components/ProtectedRoute';
// import { client } from '@/sanity/lib/client';
// import Swal from 'sweetalert2'; // SweetAlert2 for confirmation popups

// // Define TypeScript interfaces
// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   stock_quantity: number;
//   description?: string;
// }

// interface Order {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   total: number;
//   status: 'success' | 'pending' | 'dispatch';
//   orderDate: string;
//   deliveryAddress: string;
// }

// interface Metrics {
//   totalRevenue: number;
//   totalOrders: number;
//   totalCustomers: number;
//   pendingDeliveries: number;
// }

// const AdminPanel: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [activeSection, setActiveSection] = useState<'orders' | 'products'>('orders');
//   const [orderFilter, setOrderFilter] = useState<'all' | 'success' | 'pending' | 'dispatch'>('all');
//   const [metrics, setMetrics] = useState<Metrics>({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0, pendingDeliveries: 0 });

//   useEffect(() => {
//     fetchProducts();
//     fetchOrders();
//   }, []);

//   const fetchProducts = async () => {
//     const query = `*[_type == "product"]`;
//     const data = await client.fetch<Product[]>(query);
//     setProducts(data);
//   };

//   const fetchOrders = async () => {
//     const query = `*[_type == "order"]`;
//     const data = await client.fetch<Order[]>(query);
//     setOrders(data);
//     calculateMetrics(data);
//   };

//   const calculateMetrics = (orders: Order[]) => {
//     const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
//     const totalOrders = orders.length;
//     const totalCustomers = new Set(orders.map(order => order.email)).size;
//     const pendingDeliveries = orders.filter(order => order.status === 'pending').length;
//     setMetrics({ totalRevenue, totalOrders, totalCustomers, pendingDeliveries });
//   };

//   const updateOrderStatus = async (orderId: string, newStatus: 'success' | 'pending' | 'dispatch') => {
//     await client.patch(orderId).set({ status: newStatus }).commit();
//     fetchOrders();
//   };

//   const deleteProduct = async (productId: string) => {
//     await client.delete(productId);
//     fetchProducts();
//   };

//   const handleLogout = () => {
//     // Add logout logic here
//     console.log("User logged out");
//   };

//   const confirmStatusChange = (orderId: string, newStatus: 'success' | 'pending' | 'dispatch') => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: `Do you want to change the status to ${newStatus}?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, change it!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         updateOrderStatus(orderId, newStatus);
//         Swal.fire('Updated!', 'Order status has been updated.', 'success');
//       }
//     });
//   };

//   const confirmDeleteProduct = (productId: string) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: 'You will not be able to recover this product!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         deleteProduct(productId);
//         Swal.fire('Deleted!', 'Product has been deleted.', 'success');
//       }
//     });
//   };

//   const filteredOrders = orders.filter(order => {
//     if (orderFilter === 'all') return true;
//     return order.status === orderFilter;
//   });

//   return (
//     <ProtectedRoute>
//       <div className="flex h-screen">
//         {/* Left Sidebar */}
//         <div className="w-1/4 bg-gray-800 text-white p-4">
//           <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
//           <ul>
//             <li className="mb-2">
//               <button
//                 onClick={() => setActiveSection('orders')}
//                 className={`w-full text-left p-2 hover:bg-gray-700 rounded ${activeSection === 'orders' ? 'bg-gray-700' : ''}`}
//               >
//                 Orders
//               </button>
//             </li>
//             <li className="mb-2">
//               <button
//                 onClick={() => setActiveSection('products')}
//                 className={`w-full text-left p-2 hover:bg-gray-700 rounded ${activeSection === 'products' ? 'bg-gray-700' : ''}`}
//               >
//                 Products
//               </button>
//             </li>
//             <li className="mb-2">
//               <button onClick={handleLogout} className="w-full text-left p-2 hover:bg-gray-700 rounded">
//                 Logout
//               </button>
//             </li>
//           </ul>
//         </div>

//         {/* Main Content */}
//         <div className="w-3/4 p-4">
//           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//           <div className="grid grid-cols-4 gap-4 my-4">
//             <div className="bg-gray-100 p-4 rounded">Total Revenue: ${metrics.totalRevenue}</div>
//             <div className="bg-gray-100 p-4 rounded">Total Orders: {metrics.totalOrders}</div>
//             <div className="bg-gray-100 p-4 rounded">Total Customers: {metrics.totalCustomers}</div>
//             <div className="bg-gray-100 p-4 rounded">Pending Deliveries: {metrics.pendingDeliveries}</div>
//           </div>

//           {/* Orders Section */}
//           {activeSection === 'orders' && (
//             <>
//               <h2 className="text-xl font-semibold mt-6">Orders</h2>
//               <div className="flex space-x-4 my-4">
//                 <button
//                   onClick={() => setOrderFilter('all')}
//                   className={`px-4 py-2 rounded ${orderFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                 >
//                   All
//                 </button>
//                 <button
//                   onClick={() => setOrderFilter('success')}
//                   className={`px-4 py-2 rounded ${orderFilter === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
//                 >
//                   Success
//                 </button>
//                 <button
//                   onClick={() => setOrderFilter('pending')}
//                   className={`px-4 py-2 rounded ${orderFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
//                 >
//                   Pending
//                 </button>
//                 <button
//                   onClick={() => setOrderFilter('dispatch')}
//                   className={`px-4 py-2 rounded ${orderFilter === 'dispatch' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                 >
//                   Dispatch
//                 </button>
//               </div>
//               <table className="w-full border mt-2">
//                 <thead>
//                   <tr>
//                     <th className="border p-2">Name</th>
//                     <th className="border p-2">Email</th>
//                     <th className="border p-2">Total</th>
//                     <th className="border p-2">Status</th>
//                     <th className="border p-2">Order Date</th>
//                     <th className="border p-2">Delivery Address</th>
//                     <th className="border p-2">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredOrders.map(order => (
//                     <tr key={order._id} className="hover:bg-gray-100">
//                       <td className="border p-2">{order.firstName} {order.lastName}</td>
//                       <td className="border p-2">{order.email}</td>
//                       <td className="border p-2">${order.total}</td>
//                       <td className="border p-2">{order.status}</td>
//                       <td className="border p-2">{order.orderDate}</td>
//                       <td className="border p-2">{order.deliveryAddress}</td>
//                       <td className="border p-2">
//                         <button
//                           onClick={() => confirmStatusChange(order._id, 'success')}
//                           className="bg-green-500 px-2 py-1 rounded mr-2"
//                         >
//                           Success
//                         </button>
//                         <button
//                           onClick={() => confirmStatusChange(order._id, 'pending')}
//                           className="bg-yellow-500 px-2 py-1 rounded mr-2"
//                         >
//                           Pending
//                         </button>
//                         <button
//                           onClick={() => confirmStatusChange(order._id, 'dispatch')}
//                           className="bg-blue-500 px-2 py-1 rounded"
//                         >
//                           Dispatch
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </>
//           )}

//           {/* Products Section */}
//           {activeSection === 'products' && (
//             <>
//               <h2 className="text-xl font-semibold mt-6">Products</h2>
//               <table className="w-full border mt-2">
//                 <thead>
//                   <tr>
//                     <th className="border p-2">Name</th>
//                     <th className="border p-2">Price</th>
//                     <th className="border p-2">Stock</th>
//                     <th className="border p-2">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.map(product => (
//                     <tr key={product._id} className="hover:bg-gray-100">
//                       <td className="border p-2">{product.name}</td>
//                       <td className="border p-2">${product.price}</td>
//                       <td className="border p-2">{product.stock_quantity}</td>
//                       <td className="border p-2">
//                         <button
//                           onClick={() => setSelectedProduct(product)}
//                           className="bg-blue-500 px-2 py-1 rounded mr-2"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => confirmDeleteProduct(product._id)}
//                           className="bg-red-500 px-2 py-1 rounded"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </>
//           )}

//           {/* Product Details */}
//           {selectedProduct && (
//             <div className="mt-6">
//               <h2 className="text-xl font-semibold">Product Details</h2>
//               <div className="bg-gray-100 p-4 rounded mt-2">
//                 <p><strong>Name:</strong> {selectedProduct.name}</p>
//                 <p><strong>Price:</strong> ${selectedProduct.price}</p>
//                 <p><strong>Stock:</strong> {selectedProduct.stock_quantity}</p>
//                 <p><strong>Description:</strong> {selectedProduct.description || 'N/A'}</p>
//               </div>
//               <button
//                 onClick={() => setSelectedProduct(null)}
//                 className="bg-gray-500 px-2 py-1 rounded mt-2"
//               >
//                 Close
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default AdminPanel;

// const calculateMetrics = (orders: Order[]) => {
//   const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
//   const totalOrders = orders.length;
//   const totalCustomers = new Set(orders.map(order => order.email)).size;
//   const pendingDeliveries = orders.filter(order => order.status === 'pending').length;
//   setMetrics({ totalRevenue, totalOrders, totalCustomers, pendingDeliveries });
// };

// const [metrics, setMetrics] = useState<Metrics>({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0, pendingDeliveries: 0 });

// "use client"

"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { client } from "@/sanity/lib/client";
import Swal from "sweetalert2";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { useRouter } from "next/navigation";


// TypeScript Interfaces
interface Product {
  _id: string;
  name: string;
  price: number;
  stock_quantity: number;
  description?: string;
  image?: string;
  tags: string;
}
interface CartItem {
  name: string;
  image?: {
    _type: "image";
    asset: {
      _type: "reference";
      _ref: string;
    };
  };
}

interface Metrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingDeliveries: number;
}

interface Order {
  // customer: any;
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
  status: string | null;
  cartItems: CartItem[];
}
const AdminPanel: React.FC = () => {
  const [, setSelectedOrderDetails] = useState<Order | null>(null);
  const [, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    "all" | "success" | "pending" | "dispatch"
  >("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingDeliveries: 0,
  });
  const router = useRouter();


    useState<Order | null>(null);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editProductData, setEditProductData] = useState<Partial<Product>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  // const handleOrderClick = (order: Order) => {
  //   setSelectedOrderDetails(order);
  //   setIsModalOpen(true);
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleOrderClick = (order: Order) => {
  setSelectedOrderDetails(order);
  setIsModalOpen(true);
};



  const handleEditProduct = (product: Product) => {
    setEditProductId(product._id);
    setEditProductData(product);
  };

  const handleSaveProduct = async () => {
    if (!editProductId) return;
    try {
      if (imageFile) {
        const imageAsset = await client.assets.upload("image", imageFile);
        editProductData.image = imageAsset._id;
      }
      await client.patch(editProductId).set(editProductData).commit();
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editProductId ? { ...p, ...editProductData } : p
        )
      );
      setEditProductId(null);
      setEditProductData({});
      Swal.fire("Updated!", "Product details have been updated.", "success");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const calculateMetrics = (orders: Order[]) => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalCustomers = new Set(orders.map((order) => order.email)).size;
    const pendingDeliveries = orders.filter(
      (order) => order.status === "pending"
    ).length;
    setMetrics({
      totalRevenue,
      totalOrders,
      totalCustomers,
      pendingDeliveries,
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts =  async () => {
    const query = `*[_type == "product"]`;
    const data = await client.fetch<Product[]>(query);
    setProducts(data);
  };
  const fetchOrders = async () => {
    try {
      const query = `*[_type == "order"]{
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
      }`;
      const data = await client.fetch<Order[]>(query);
      setOrders(data);
      calculateMetrics(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    const result = await Swal.fire({
      title: "Confirm Status Change?",
      text: `Change order status to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      await client.patch(orderId).set({ status: newStatus }).commit();
      fetchOrders();
      Swal.fire("Updated!", "Order status updated successfully", "success");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      await client.delete(productId);
      fetchProducts();
      Swal.fire("Deleted!", "Product removed successfully", "success");
    }
  };

  const filteredOrders = orders.filter((order) =>
    orderStatusFilter === "all" ? true : order.status === orderStatusFilter
  );

  
  const handleDeleteOrder = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Clear login status
    router.push("/"); // Redirect to login page or home page
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <header className="bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center gap-4 md:gap-10 justify-between">
    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
      <div className="bg-gray-100 p-4 rounded flex items-center gap-2">
        <Image src="/revenue.png" alt="revenue-icon" width={50} height={50} />
        <span>Total Revenue: ${metrics.totalRevenue}</span>
      </div>
      <div className="bg-gray-100 p-4 rounded flex items-center gap-2">
        <Image src="/cart.png" alt="orders-icon" width={50} height={50} />
        <span>Total Orders: {metrics.totalOrders}</span>
      </div>
      <div className="bg-gray-100 p-4 rounded flex items-center gap-2">
        <Image src="/customer.png" alt="customers-icon" width={50} height={50} />
        <span>Total Customers: {metrics.totalCustomers}</span>
      </div>
      <div className="bg-gray-100 p-4 rounded flex items-center gap-2">
        <Image src="/delivery.png" alt="deliveries-icon" width={50} height={50} />
        <span>Pending Deliveries: {metrics.pendingDeliveries}</span>
      </div>
    </div>
    
    <button
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      onClick={handleLogout}

    >
      Logout
    </button>
  </div>
</header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              className={`pb-2 px-1 ${activeTab === "orders" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </button>
            <button
              className={`pb-2 px-1 ${activeTab === "products" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
          </div>

          {activeTab === "orders" ? (
            <div className="bg-white rounded-lg shadow">
              {/* Order Status Filters */}
              <div className="p-4 border-b border-gray-200 flex gap-2">
                {["all", "pending", "dispatch", "success"].map((status) => (
               <button
               key={status}
               className={`px-4 py-2 rounded-full capitalize ${
                 orderStatusFilter === status
                   ? "bg-blue-500 text-white"
                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
               }`}
               onClick={() => setOrderStatusFilter(status as "all" | "pending" | "dispatch" | "success")}
             >
               {status}
             </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
  <table className="w-full min-w-max">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
          Order ID
        </th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
          Customer
        </th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
          Date
        </th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
          Amount
        </th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
          Status
        </th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {filteredOrders.map((order) => (
        <tr key={order._id} className="hover:bg-gray-50 text-sm">
          <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
            #{order._id.slice(-6)}
          </td>
          <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
            <div>{order.firstName} {order.lastName}</div>
            <div className="text-gray-500 text-xs">{order.email}</div>
          </td>
          <td className="px-4 py-2 text-gray-500 whitespace-nowrap">
            {new Date(order.orderDate).toLocaleDateString()}
          </td>
          <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
            ${order.total}
          </td>
          <td className="px-4 py-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.status === "success" ? "bg-green-100 text-green-800" :
              order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
              "bg-blue-100 text-blue-800"}`}
            >
              {order.status}
            </span>
          </td>
          <td className="px-4 py-2 space-x-2 whitespace-nowrap">
            <button className="text-blue-600 hover:text-blue-900 text-xs" onClick={() => handleOrderClick(order)}>
              View
            </button>
            <button onClick={() => handleDeleteOrder(order._id)} className="text-red-600 transition text-xs">
              Delete
            </button>
            <div className="inline-block space-x-1">
              {["pending", "dispatch", "success"].map((status) => (
                <button
                  key={status}
                  className={`text-xs px-2 py-1 rounded ${
                    order.status === status ? "bg-gray-100 text-gray-600" : "hover:bg-gray-100 text-gray-500"}`}
                  onClick={() => handleStatusUpdate(order._id, status as Order["status"])}
                >
                  {status}
                </button>
              ))}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {product.image && (
                              <Image
                                src={urlFor(product.image).url()}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover mr-3"
                                width={1000}
                                height={1000}
                              />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {product.description || "No description"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {product.stock_quantity}
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </button>
                          {/* 
                          {selectedProduct && (
                            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                              <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold">
                                  Edit Product
                                </h2>
                                <input
                                  type="text"
                                  value={selectedProduct.name}
                                  onChange={(e) =>
                                    setSelectedProduct({
                                      ...selectedProduct,
                                      name: e.target.value,
                                    })
                                  }
                                  className="border p-2 mb-4"
                                />
                                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                                  Save
                                </button>
                              </div>
                            </div>
                          )} */}

                          {/* Edit Product Modal */}
                          {editProductId && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                              <div className="bg-white p-6 rounded shadow w-1/3">
                                <h3 className="text-xl font-bold mb-4">
                                  Edit Product
                                </h3>
                                <input
                                  type="text"
                                  value={editProductData.name || ""}
                                  onChange={(e) =>
                                    setEditProductData({
                                      ...editProductData,
                                      name: e.target.value,
                                    })
                                  }
                                  className="border p-2 w-full mb-4"
                                />
                                <input
                                  type="text"
                                  value={editProductData.description || ""}
                                  onChange={(e) =>
                                    setEditProductData({
                                      ...editProductData,
                                      description: e.target.value,
                                    })
                                  }
                                  className="border p-2 w-full mb-4"
                                />
                                <input
                                  type="number"
                                  value={editProductData.price || ""}
                                  onChange={(e) =>
                                    setEditProductData({
                                      ...editProductData,
                                      price: Number(e.target.value),
                                    })
                                  }
                                  className="border p-2 w-full mb-4"
                                />
                                <input
                                  type="number"
                                  value={editProductData.stock_quantity || ""}
                                  onChange={(e) =>
                                    setEditProductData({
                                      ...editProductData,
                                      stock_quantity: Number(e.target.value),
                                    })
                                  }
                                  className="border p-2 w-full mb-4"
                                />
                                <input
                                  type="file"
                                  className="border p-2 w-full mb-4"
                                  onChange={(e) =>
                                    setImageFile(e.target.files?.[0] || null)
                                  }
                                />
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => setEditProductId(null)}
                                    className="bg-gray-400 px-4 py-2 rounded"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSaveProduct}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedProduct(null)}
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Price:</p>
                  <p>${selectedProduct.price}</p>
                </div>
                <div>
                  <p className="font-medium">Stock:</p>
                  <p>{selectedProduct.stock_quantity}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Description:</p>
                  <p className="text-gray-600">
                    {selectedProduct.description || "No description available"}
                  </p>
                  <div>
                    <p className="font-medium">Tags:</p>
                    <p>{selectedProduct.tags} </p>
                  </div>
                </div>
                {selectedProduct.image && (
                  <div className="col-span-2">
                    <Image
                      src={urlFor(selectedProduct.image).url()}
                      alt={selectedProduct.name}
                      className="w-full h-48 object-contain"
                      width={1000}
                      height={1000}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminPanel;
// function setIsModalOpen(arg0: boolean) {
//   throw new Error("Function not implemented.");
// }

// function setSelectedOrderDetails(order: Order) {
//   throw new Error("Function not implemented.");
// }

