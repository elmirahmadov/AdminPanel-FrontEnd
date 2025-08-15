import React from "react";

import { Card, Col, Row, Statistic } from "antd";
import CountUp from "react-countup";

import styles from "../Dashboard.module.css";

export interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

interface StatCardsProps {
  statCards: StatCard[];
}

const StatCards: React.FC<StatCardsProps> = ({ statCards }) => (
  <Row gutter={[16, 16]} className={styles.statsRow}>
    {statCards.map((stat, i) => (
      <Col
        key={i}
        xs={24}
        sm={8}
        md={8}
        lg={8}
        xl={8}
        className={styles.statCol}
      >
        <Card
          variant="borderless"
          styles={{ body: { padding: "20px" } }}
          className={styles.statCard}
        >
          <Statistic
            title={stat.label}
            value={stat.value}
            formatter={(value) => {
              // If the value is a number, use CountUp, otherwise display as is
              if (typeof value === "number" || !isNaN(Number(value))) {
                return (
                  <CountUp end={Number(value)} duration={1} separator="," />
                );
              }
              return value;
            }}
            prefix={
              <span className={styles.statIcon} style={{ color: stat.color }}>
                {stat.icon}
              </span>
            }
            valueStyle={{
              fontWeight: 700,
              fontSize: "1.5rem",
            }}
          />
        </Card>
      </Col>
    ))}
  </Row>
);

export default StatCards;
