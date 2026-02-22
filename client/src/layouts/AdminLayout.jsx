import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./admin.css";

// Material Icons
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <nav className="admin-topnav">
        <div className="admin-logo">SmartGrocery Admin</div>

        <div className="admin-links">
          <NavLink to="/admin/dashboard" className="admin-nav-item">
            <DashboardIcon />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/products" className="admin-nav-item">
            <InventoryIcon />
            <span>Products</span>
          </NavLink>

          <NavLink to="/admin/orders" className="admin-nav-item">
            <ShoppingBagIcon />
            <span>Orders</span>
          </NavLink>

          <NavLink to="/admin/users" className="admin-nav-item">
            <PeopleIcon />
            <span>Users</span>
          </NavLink>
        </div>
      </nav>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;