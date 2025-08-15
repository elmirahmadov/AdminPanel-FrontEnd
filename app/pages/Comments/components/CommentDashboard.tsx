import React from "react";
import {
  Card,
  Col,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Typography,
} from "antd";
import {
  BarChartOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";

import styles from "./CommentDashboard.module.css";

const { Text } = Typography;

interface DashboardStats {
  totalComments: number;
  pendingModeration: number;
  dailyGrowth: number;
  approvedComments: number;
  rejectedComments: number;
  hiddenComments: number;
  averageRating: number;
  activeUsers: number;
}

interface CommentDashboardProps {
  dashboardStats: DashboardStats;
}

const CommentDashboard: React.FC<CommentDashboardProps> = ({
  dashboardStats,
}) => {
  return (
    <div className={styles.dashboard}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Yorum"
              value={dashboardStats.totalComments}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bekleyen Moderasyon"
              value={dashboardStats.pendingModeration}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Günlük Artış"
              value={dashboardStats.dailyGrowth}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: "#52c41a" }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Onaylanan"
              value={dashboardStats.approvedComments}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.statisticsRow}>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Yorum Durumu" className={styles.quickStatsCard}>
            <List
              size="small"
              className={styles.quickStatsList}
              dataSource={[
                {
                  label: "Onaylanan",
                  value: dashboardStats.approvedComments,
                  icon: <StarOutlined className={styles.quickStatsIcon} />,
                },
                {
                  label: "Reddedilen",
                  value: dashboardStats.rejectedComments,
                  icon: <UserOutlined className={styles.quickStatsIcon} />,
                },
                {
                  label: "Gizlenen",
                  value: dashboardStats.hiddenComments,
                  icon: <UserOutlined className={styles.quickStatsIcon} />,
                },
              ]}
              renderItem={(item) => (
                <List.Item className={styles.quickStatsItem}>
                  {item.icon}
                  <span>
                    {item.label}: {item.value}
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Genel İstatistikler" className={styles.quickStatsCard}>
            <div className={styles.progressContainer}>
              <Progress
                type="circle"
                percent={
                  dashboardStats.totalComments > 0
                    ? Math.round(
                        (dashboardStats.approvedComments /
                          dashboardStats.totalComments) *
                          100
                      )
                    : 0
                }
                format={(percent) => `${percent}%`}
                strokeColor="#52c41a"
              />
              <div className={styles.progressText}>
                <Text>Onay Oranı</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card title="Kullanıcı Aktivitesi" className={styles.quickStatsCard}>
            <List
              size="small"
              className={styles.quickStatsList}
              dataSource={[
                {
                  label: "Aktif Kullanıcılar",
                  value: dashboardStats.activeUsers,
                  icon: <UserOutlined className={styles.quickStatsIcon} />,
                },
                {
                  label: "Ortalama Puan",
                  value: dashboardStats.averageRating.toFixed(1),
                  icon: <StarOutlined className={styles.quickStatsIcon} />,
                },
              ]}
              renderItem={(item) => (
                <List.Item className={styles.quickStatsItem}>
                  {item.icon}
                  <span>
                    {item.label}: {item.value}
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CommentDashboard;
