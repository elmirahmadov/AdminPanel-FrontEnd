import { lazy, Suspense, useEffect, useState } from "react";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import styles from "./App.module.css";
import AdminHeader from "./common/components/Header/Header";
import { Loading } from "./common/components/Loading";
import Sidebar from "./common/components/Sidebar/Sidebar";
import { ROUTER } from "./common/constants/router";

// global.css zaten `main.tsx` içinde import ediliyor

const Login = lazy(() => import("./pages/Login/AdminLogin"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Anime = lazy(() => import("./pages/Animes/AnimeList"));
const Category = lazy(() => import("./pages/Category/GenreList"));
const Characters = lazy(() => import("./pages/Characters/CharacterList"));
const Comments = lazy(() => import("./pages/Comments/CommentList"));
const Forum = lazy(() => import("./pages/Forum/ForumList"));
const Periods = lazy(() => import("./pages/Periods/PeriodsList"));

function App() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; speed: number }>
  >([]);

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: 0.5 + Math.random() * 2,
    }));
    setParticles(newParticles);

    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y - particle.speed,
          x: particle.x + Math.sin(particle.y / 30) * 0.5,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  if (location.pathname === ROUTER.LOGIN) {
    return (
      <Suspense fallback={<Loading full />}>
        <Routes>
          <Route path={ROUTER.LOGIN} element={<Login />} />
        </Routes>
      </Suspense>
    );
  }

  if (!token) {
    return <Navigate to={ROUTER.LOGIN} />;
  }

  return (
    <div className={styles.app}>
      {/* Floating Particles */}
      <div className={styles.particlesContainer}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.id * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Animated Background */}
      <div className={styles.animatedBackground}>
        <div className={styles.sakuraPetals}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className={styles.sakuraPetal}
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </div>
      </div>

      <div className={styles.header}>
        <AdminHeader />
      </div>
      <div className={styles.bodyArea}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.mainArea}>
          <div className={styles.container}>
            <main className={styles.content}>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path={ROUTER.DASHBOARD} element={<Dashboard />} />
                  <Route path={ROUTER.ANİMES} element={<Anime />} />
                  <Route path={ROUTER.Category} element={<Category />} />
                  <Route path={ROUTER.CHARACTERS} element={<Characters />} />
                  <Route path={ROUTER.COMMENTS} element={<Comments />} />
                  <Route path={ROUTER.FORUM} element={<Forum />} />
                  <Route path={ROUTER.PERIODS} element={<Periods />} />
                  <Route
                    path="/"
                    element={<Navigate to={ROUTER.DASHBOARD} />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to={ROUTER.DASHBOARD} />}
                  />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
