import React from "react";

import { EyeOutlined } from "@ant-design/icons";
import { Card, List } from "antd";

import styles from "../Dashboard.module.css";

interface MostWatchedAnimesProps {
  mostWatchedAnimes: { name: string; views: string }[];
}

const MostWatchedAnimes: React.FC<MostWatchedAnimesProps> = ({
  mostWatchedAnimes,
}) => {
  return (
    <Card
      variant="borderless"
      className={styles.card}
      title={<span className={styles.cardTitle}>En Çok İzlenen Anime</span>}
      styles={{ body: { padding: "20px" } }}
    >
      <List
        itemLayout="horizontal"
        dataSource={mostWatchedAnimes}
        renderItem={(item) => (
          <List.Item className={styles.listItem}>
            <span className={styles.listLabel}>{item.name}</span>
            <span className={styles.listValue}>
              <EyeOutlined style={{ color: "#4f8cff", marginRight: 4 }} />
              {item.views}
            </span>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default MostWatchedAnimes;
