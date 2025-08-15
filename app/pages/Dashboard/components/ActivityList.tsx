import React from "react";

import { QuestionCircleOutlined } from "@ant-design/icons";
import { Card, List, Tag } from "antd";

import styles from "../Dashboard.module.css";
import { IDashboardStats } from "@/common/types/api.types";

interface ActivityListProps {
  stats: IDashboardStats | null;
}

const ActivityList: React.FC<ActivityListProps> = ({ stats }) => {
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

  const activities = [
    {
      color: "purple",
      label: "Toplam yorum",
      value: getSafeValue(stats?.totalComments),
    },
    {
      color: "red",
      label: "Toplam rapor",
      value: getSafeValue(stats?.totalReports),
    },
    {
      color: "green",
      label: "Bekleyen rapor",
      value: getSafeValue(stats?.pendingReports),
    },
    {
      color: "blue",
      label: "Toplam izlenme",
      value: getSafeValue(stats?.totalViews),
    },
    {
      color: "orange",
      label: "Son güncelleme",
      value: stats?.lastUpdated
        ? new Date(stats.lastUpdated).toLocaleDateString("tr-TR")
        : "N/A",
    },
  ];

  return (
    <Card
      variant="borderless"
      className={styles.card}
      title={<span className={styles.cardTitle}>Aktivite</span>}
      styles={{ body: { padding: "20px" } }}
    >
      <List
        itemLayout="horizontal"
        dataSource={activities}
        renderItem={(item) => (
          <List.Item className={styles.listItem}>
            <Tag color={item.color} className={styles.colorTag} />
            <span className={styles.listLabel}>{item.label}</span>
            <span className={styles.listValue}>
              {item.value !== undefined &&
              item.value !== null &&
              item.value !== "N/A" ? (
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

export default ActivityList;
