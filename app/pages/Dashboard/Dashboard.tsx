import React, { useEffect } from "react";

import {
  CommentOutlined,
  EyeOutlined,
  HeartOutlined,
  SolutionOutlined,
  StarOutlined,
  TagsOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import ActivityList from "./components/ActivityList";
import CategoryList from "./components/CategoryList";
import MostWatchedAnimes from "./components/MostWatchedAnimes";
import StatCards from "./components/StatCards";
import TopRatedAnimes from "./components/TopRatedAnimes";
import styles from "./Dashboard.module.css";

import { Loading } from "@/common/components/Loading";
import {
  useDashboardActions,
  useDashboardStats,
} from "@/common/store/dashboard";

const Dashboard: React.FC = () => {
  const { getStats } = useDashboardActions();
  const { stats, loading } = useDashboardStats();

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getStats();
      } catch {
        // handled in store via default stats
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading durumunda Loading bileşenini göster
  if (loading) {
    return <Loading />;
  }

  // Stats null kontrolü - fallback değerlerle
  const safeStats = stats || {
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    totalAnimes: 0,
    totalComments: 0,
    totalReports: 0,
    totalViews: 0,
    pendingReports: 0,
    lastUpdated: new Date().toISOString(),
  };

  // Stat kartları: Kullanıcı ve Aktivite
  const userActivityStats = [
    {
      icon: <UserOutlined />,
      label: "Kullanıcı",
      value:
        typeof safeStats?.totalUsers === "number" ? safeStats.totalUsers : 0,
      color: "#34d399",
    },
    {
      icon: <EyeOutlined />,
      label: "İzlenme",
      value:
        typeof safeStats?.totalViews === "number" ? safeStats.totalViews : 0,
      color: "#4f8cff",
    },
    {
      icon: <CommentOutlined />,
      label: "Yorum",
      value:
        typeof safeStats?.totalComments === "number"
          ? safeStats.totalComments
          : 0,
      color: "#f87171",
    },
    {
      icon: <StarOutlined />,
      label: "Aktif Kullanıcı",
      value:
        typeof safeStats?.activeUsers === "number" ? safeStats.activeUsers : 0,
      color: "#fbbf24",
    },
    {
      icon: <WarningOutlined />,
      label: "Rapor",
      value:
        typeof safeStats?.totalReports === "number"
          ? safeStats.totalReports
          : 0,
      color: "#f59e42",
    },
  ];

  // Ekstra stat kartları
  const extraStats = [
    {
      icon: <SolutionOutlined />,
      label: "Bekleyen Rapor",
      value:
        typeof safeStats?.pendingReports === "number"
          ? safeStats.pendingReports
          : 0,
      color: "#06b6d4",
    },
    {
      icon: <TagsOutlined />,
      label: "Toplam Anime",
      value:
        typeof safeStats?.totalAnimes === "number" ? safeStats.totalAnimes : 0,
      color: "#8b5cf6",
    },
    {
      icon: <HeartOutlined />,
      label: "Yasaklı Kullanıcı",
      value:
        typeof safeStats?.bannedUsers === "number" ? safeStats.bannedUsers : 0,
      color: "#f43f5e",
    },
    {
      icon: <HeartOutlined />,
      label: "Son Güncelleme",
      value: safeStats?.lastUpdated
        ? new Date(safeStats.lastUpdated).toLocaleDateString("tr-TR")
        : "N/A",
      color: "#ef4444",
    },
  ];

  // Dummy data (API'dan gerçek veri gelirse burası güncellenebilir)
  const mostWatchedAnimes = [
    { name: "Demon Slayer", views: "1.2M" },
    { name: "Attack on Titan", views: "1.1M" },
    { name: "One Piece", views: "950K" },
    { name: "My Hero Academia", views: "870K" },
    { name: "Jujutsu Kaisen", views: "800K" },
  ];
  const topRatedAnimes = [
    { name: "Jujutsu Kaisen", rating: 4.9 },
    { name: "Fullmetal Alchemist", rating: 4.8 },
    { name: "Steins;Gate", rating: 4.8 },
    { name: "Death Note", rating: 4.7 },
    { name: "Attack on Titan", rating: 4.7 },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.sectionTitle}>Kullanıcı ve Aktivite</h2>
      <StatCards statCards={userActivityStats} />

      <div className={styles.statsSection}>
        <div className={styles.statsColumn}>
          <CategoryList stats={safeStats} />
        </div>
        <div className={styles.statsColumn}>
          <ActivityList stats={safeStats} />
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Ekstra İstatistikler</h2>
      <StatCards statCards={extraStats} />

      <div className={styles.statsSectionWrapped}>
        <div className={styles.statsColumn}>
          <MostWatchedAnimes mostWatchedAnimes={mostWatchedAnimes} />
        </div>
        <div className={styles.statsColumn}>
          <TopRatedAnimes topRatedAnimes={topRatedAnimes} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
