import React from "react";

import { QuestionCircleOutlined } from "@ant-design/icons";
import { Card, List, Tag } from "antd";

import styles from "../Dashboard.module.css";
import { IDashboardStats } from "@/common/types/api.types";

interface CategoryListProps {
  stats: IDashboardStats | null;
}

const CategoryList: React.FC<CategoryListProps> = ({ stats }) => {
  const getSafeValue = (val: unknown): number => {
    if (typeof val === "number") return val;
    if (val && typeof val === "object") {
      if (typeof (val as { value?: number }).value === "number")
        return (val as { value: number }).value;
      if (typeof (val as { count?: number }).count === "number")
        return (val as { count: number }).count;
      if (Array.isArray(val)) return val.length;
    }
    if (typeof val === "string" && !isNaN(Number(val))) return Number(val);
    return 0;
  };
  const categories = [
    { color: "blue", label: "Anime", value: getSafeValue(stats?.totalAnimes) },
    {
      color: "green",
      label: "Aktif Kullanıcı",
      value: getSafeValue(stats?.activeUsers),
    },
    {
      color: "purple",
      label: "Toplam Kullanıcı",
      value: getSafeValue(stats?.totalUsers),
    },
    {
      color: "orange",
      label: "Yasaklı Kullanıcı",
      value: getSafeValue(stats?.bannedUsers),
    },
    {
      color: "pink",
      label: "Toplam İzlenme",
      value: getSafeValue(stats?.totalViews),
    },
  ];
  return (
    <Card
      variant="borderless"
      className={styles.card}
      title={<span className={styles.cardTitle}>Kategoriler</span>}
      styles={{ body: { padding: "20px" } }}
    >
      <List
        itemLayout="horizontal"
        dataSource={categories}
        renderItem={(item) => (
          <List.Item className={styles.listItem}>
            <Tag color={item.color} className={styles.colorTag} />
            <span className={styles.listLabel}>{item.label}</span>
            <span className={styles.listValue}>
              {item.value !== undefined && item.value !== null ? (
                item.value
              ) : (
                <QuestionCircleOutlined />
              )}
            </span>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CategoryList;
