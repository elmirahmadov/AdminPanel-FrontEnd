import React from "react";

import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";

import { ROUTER } from "@/common/constants/router";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey = location.pathname;

  const handleMenuClick = (key: string) => {
    if (key === "logout") {
      localStorage.removeItem("access_token");
      window.location.href = ROUTER.LOGIN;
    } else {
      navigate(key);
    }
  };

  const items = [
    {
      key: ROUTER.DASHBOARD,
      icon: (
        <span className="anticon">
          <i className="anticon anticon-dashboard" />
        </span>
      ),
      label: "Dashboard",
    },
    {
      key: "animes",
      icon: (
        <span className="anticon">
          <i className="anticon anticon-film" />
        </span>
      ),
      label: "Animeler",
      children: [
        { key: "/animes", label: "Anime Listesi" },
        { key: "/characters", label: "Karakterler" },
        { key: "/categories", label: "Kategoriler" },
        { key: "/comments", label: "Yorumlar" },
        { key: "/forum", label: "Forumlar" },
        { key: "/periods", label: "Mevsimler" },
      ],
    },
    {
      key: "/users",
      icon: (
        <span className="anticon">
          <i className="anticon anticon-user" />
        </span>
      ),
      label: "Kullanıcılar",
    },
    {
      key: "/levels",
      icon: (
        <span className="anticon">
          <i className="anticon anticon-trophy" />
        </span>
      ),
      label: "Seviye Sistemi",
    },
    {
      key: "tasks",
      icon: (
        <span className="anticon">
          <i className="anticon anticon-check-square" />
        </span>
      ),
      label: "Görevler",
      children: [
        { key: "/tasks/list", label: "Görev Listesi" },
        { key: "/tasks/active", label: "Aktif Görevler" },
        { key: "/tasks/completed", label: "Tamamlanan Görevler" },
      ],
    },
    {
      key: "premium",
      icon: (
        <span className="anticon">
          <i className="anticon anticon-crown" />
        </span>
      ),
      label: "Premium İçerik",
      children: [
        { key: "/premium/anime", label: "Premium Animeler" },
        { key: "/premium/users", label: "Premium Kullanıcılar" },
      ],
    },
    {
      key: "/reports",
      icon: (
        <span className="anticon">
          <i className="anticon anticon-bar-chart" />
        </span>
      ),
      label: "Raporlar",
    },
    {
      key: "logout",
      icon: (
        <span className="anticon">
          <i className="anticon anticon-logout" />
        </span>
      ),
      label: "Çıkış",
    },
  ];

  return (
    <div className={styles.sidebar}>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className={styles.customMenu}
        onClick={({ key }) => handleMenuClick(key)}
        defaultOpenKeys={["animes"]}
        items={items}
      />
    </div>
  );
};

export default Sidebar;
