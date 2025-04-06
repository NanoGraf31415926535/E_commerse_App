import React from 'react';
import { useCart } from '../functions/CartContext.jsx'; // Import useCart

function OrderHistory() {
  const { cart } = useCart(); // Access cart data

  // Convert cart data to order format
  const orders = cart.length > 0 ? [
    {
      id: 1, // You might need a unique ID generation logic
      date: new Date().toLocaleDateString(),
      items: cart.map((item) => ({
        name: item.name,
        quantity: 1, // Assuming each item is added once
        price: item.price,
      })),
      total: cart.reduce((acc, item) => acc + item.price, 0),
      status: 'Pending', // Or any default status
    },
  ] : [];

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <p>Your order history is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Items</th>
                <th className="py-3 px-6 text-right text-sm font-semibold text-gray-700">Total</th>
                <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-4 px-6 text-sm text-gray-800">{order.id}</td>
                  <td className="py-4 px-6 text-sm text-gray-800">{order.date}</td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.name} ({item.quantity})
                      </div>
                    ))}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800 text-right">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6 text-sm text-center">
                    <span className={`px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;