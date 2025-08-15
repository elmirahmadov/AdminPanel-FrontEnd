import React from "react";

import styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Anime Hunt</h1>
        </div>

        <div className={styles.profileSection}>
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=92d871&color=fff&rounded=true&size=40"
            alt="Admin Avatar"
            className={styles.avatar}
          />
          <span className={styles.adminName}>Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
