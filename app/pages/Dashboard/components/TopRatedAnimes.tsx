import React from "react";

import { StarOutlined } from "@ant-design/icons";
import { Card, List } from "antd";

import styles from "../Dashboard.module.css";

interface TopRatedAnimesProps {
  topRatedAnimes: { name: string; rating: number }[];
}

const TopRatedAnimes: React.FC<TopRatedAnimesProps> = ({ topRatedAnimes }) => {
  return (
    <Card
      variant="borderless"
      className={styles.card}
      title={<span className={styles.cardTitle}>En Çok Beğenilen Anime</span>}
      styles={{ body: { padding: "20px" } }}
    >
      <List
        itemLayout="horizontal"
        dataSource={topRatedAnimes}
        renderItem={(item) => (
          <List.Item className={styles.listItem}>
            <span className={styles.listLabel}>{item.name}</span>
            <span className={styles.listValue}>
              <StarOutlined style={{ color: "#fbbf24", marginRight: 4 }} />
              {item.rating}
            </span>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TopRatedAnimes;
