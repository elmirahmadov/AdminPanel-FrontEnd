import React from "react";

import { Card, Col, Row, Statistic } from "antd";
import ReactECharts from "echarts-for-react";

import styles from "../Dashboard.module.css";

interface ChartDataPoint {
  date: string;
  views: number;
  comments: number;
  newUsers: number;
  episodes: number;
}

interface AnalyticsChartProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dailyData: ChartDataPoint[];
  weeklyData: ChartDataPoint[];
  monthlyData: ChartDataPoint[];
}

interface TransformedChartData {
  date: string;
  value: number;
  type: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  activeTab,
  setActiveTab,
  dailyData,
  weeklyData,
  monthlyData,
}) => {
  const getChartData = (period: string): TransformedChartData[] => {
    const rawData = (() => {
      switch (period) {
        case "daily":
          return dailyData;
        case "weekly":
          return weeklyData;
        case "monthly":
          return monthlyData;
        default:
          return dailyData;
      }
    })();
    const transformedData: TransformedChartData[] = [];
    rawData.forEach((item) => {
      transformedData.push(
        { date: item.date, value: item.views, type: "İzlenme" },
        { date: item.date, value: item.comments, type: "Yorumlar" },
        { date: item.date, value: item.newUsers, type: "Yeni Kullanıcılar" },
        { date: item.date, value: item.episodes, type: "Yeni Bölümler" }
      );
    });
    return transformedData;
  };

  const getChartSummary = (period: string) => {
    let totalViews = 0,
      totalComments = 0,
      totalUsers = 0,
      totalEpisodes = 0;
    if (period === "daily") {
      dailyData.forEach((d) => {
        totalViews += d.views;
        totalComments += d.comments;
        totalUsers += d.newUsers;
        totalEpisodes += d.episodes;
      });
    } else if (period === "weekly") {
      weeklyData.forEach((d) => {
        totalViews += d.views;
        totalComments += d.comments;
        totalUsers += d.newUsers;
        totalEpisodes += d.episodes;
      });
    } else if (period === "monthly") {
      monthlyData.forEach((d) => {
        totalViews += d.views;
        totalComments += d.comments;
        totalUsers += d.newUsers;
        totalEpisodes += d.episodes;
      });
    }
    return {
      totalViews,
      totalComments,
      totalUsers,
      totalEpisodes,
    };
  };

  const chartSummary = getChartSummary(activeTab);

  return (
    <Card
      variant="borderless"
      className={styles.chartCard}
      title={<span className={styles.cardTitle}>İzlenme Analitiği</span>}
      styles={{ body: { padding: "20px" } }}
      extra={
        <div>
          <button
            className={
              activeTab === "daily"
                ? `${styles.chartTabButton} ${styles.chartTabButtonActive}`
                : styles.chartTabButton
            }
            onClick={() => setActiveTab("daily")}
          >
            Günlük
          </button>
          <button
            className={
              activeTab === "weekly"
                ? `${styles.chartTabButton} ${styles.chartTabButtonActive}`
                : styles.chartTabButton
            }
            onClick={() => setActiveTab("weekly")}
          >
            Haftalık
          </button>
          <button
            className={
              activeTab === "monthly"
                ? `${styles.chartTabButton} ${styles.chartTabButtonActive}`
                : styles.chartTabButton
            }
            onClick={() => setActiveTab("monthly")}
          >
            Aylık
          </button>
        </div>
      }
    >
      {/* Özet istatistikler */}
      <Row gutter={[16, 16]} style={{ marginBottom: 12 }}>
        <Col xs={12} sm={6} md={6} lg={6} xl={6}>
          <Card
            variant="borderless"
            className={styles.statCard}
            styles={{ body: { padding: 12 } }}
          >
            <Statistic
              title={<span className={styles.statLabel}>İzlenme</span>}
              value={chartSummary.totalViews}
              valueStyle={{
                color: "#4f8cff",
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} xl={6}>
          <Card
            variant="borderless"
            className={styles.statCard}
            styles={{ body: { padding: 12 } }}
          >
            <Statistic
              title={<span className={styles.statLabel}>Yorum</span>}
              value={chartSummary.totalComments}
              valueStyle={{
                color: "#34d399",
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} xl={6}>
          <Card
            variant="borderless"
            className={styles.statCard}
            styles={{ body: { padding: 12 } }}
          >
            <Statistic
              title={<span className={styles.statLabel}>Yeni Kullanıcı</span>}
              value={chartSummary.totalUsers}
              valueStyle={{
                color: "#fbbf24",
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} xl={6}>
          <Card
            variant="borderless"
            className={styles.statCard}
            styles={{ body: { padding: 12 } }}
          >
            <Statistic
              title={<span className={styles.statLabel}>Bölüm</span>}
              value={chartSummary.totalEpisodes}
              valueStyle={{
                color: "#f87171",
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            />
          </Card>
        </Col>
      </Row>
      <div className={styles.chartContainer}>
        <ReactECharts
          style={{ height: 200, width: "100%" }}
          option={{
            backgroundColor: "#23263a",
            color: ["#4f8cff", "#34d399", "#fbbf24", "#a78bfa"],
            tooltip: {
              trigger: "axis",
              backgroundColor: "#1a1e2e",
              borderColor: "#3a3f54",
              borderWidth: 1,
              textStyle: { color: "#fff", fontSize: 12 },
              axisPointer: {
                type: "cross",
                label: { backgroundColor: "#23263a" },
              },
            },
            legend: {
              data: [
                "İzlenme",
                "Yorumlar",
                "Yeni Kullanıcılar",
                "Yeni Bölümler",
              ],
              top: 10,
              right: 10,
              textStyle: { color: "#bfc9da" },
            },
            grid: {
              left: 40,
              right: 20,
              top: 40,
              bottom: 30,
              containLabel: true,
            },
            xAxis: {
              type: "category",
              data: getChartData(activeTab)
                .filter((d) => d.type === "İzlenme")
                .map((d) => d.date),
              axisLine: { lineStyle: { color: "#3a3f54" } },
              axisLabel: { color: "#bfc9da", fontSize: 11 },
            },
            yAxis: {
              type: "value",
              axisLine: { lineStyle: { color: "#3a3f54" } },
              splitLine: {
                lineStyle: { color: "#3a3f54", type: "dashed" },
              },
              axisLabel: { color: "#bfc9da", fontSize: 11 },
            },
            dataZoom: [{ type: "inside", start: 0, end: 100 }],
            series: [
              {
                name: "İzlenme",
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 7,
                lineStyle: { width: 3 },
                itemStyle: { color: "#4f8cff" },
                data: (activeTab === "daily"
                  ? dailyData
                  : activeTab === "weekly"
                    ? weeklyData
                    : monthlyData
                ).map((d) => d.views),
                areaStyle: { color: "rgba(79,140,255,0.08)" },
              },
              {
                name: "Yorumlar",
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 7,
                lineStyle: { width: 3 },
                itemStyle: { color: "#34d399" },
                data: (activeTab === "daily"
                  ? dailyData
                  : activeTab === "weekly"
                    ? weeklyData
                    : monthlyData
                ).map((d) => d.comments),
              },
              {
                name: "Yeni Kullanıcılar",
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 7,
                lineStyle: { width: 3 },
                itemStyle: { color: "#fbbf24" },
                data: (activeTab === "daily"
                  ? dailyData
                  : activeTab === "weekly"
                    ? weeklyData
                    : monthlyData
                ).map((d) => d.newUsers),
              },
              {
                name: "Yeni Bölümler",
                type: "line",
                smooth: true,
                symbol: "circle",
                symbolSize: 7,
                lineStyle: { width: 3 },
                itemStyle: { color: "#a78bfa" },
                data: (activeTab === "daily"
                  ? dailyData
                  : activeTab === "weekly"
                    ? weeklyData
                    : monthlyData
                ).map((d) => d.episodes),
              },
            ],
          }}
          opts={{ renderer: "canvas" }}
          theme={undefined}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </Card>
  );
};

export default AnalyticsChart;
