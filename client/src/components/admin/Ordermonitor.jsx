import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/ordermonitoring.css"; // Import the CSS file

const OrderMonitoring = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders from the backend API
    axios
      .get("http://localhost:3001/api/orders") // Backend URL
      .then((response) => {
        setOrders(response.data); // Set orders to state
        setIsLoading(false); // Set loading state to false
      })
      .catch((err) => {
        setError("Error fetching orders"); // Set error state
        setIsLoading(false); // Set loading state to false
      });
  }, []); // Empty dependency array means it will run once on mount

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="order-monitoring-container">
      <h3 className="title">Order Monitoring</h3>
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Name</th>
              <th>Book Name</th>
              <th>Order Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{order.user}</td>
                <td>{order.book}</td>
                <td>{order.date}</td>
                <td>
                  <span className={`status ${order.status === "Completed" ? "completed" : "pending"}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderMonitoring;
