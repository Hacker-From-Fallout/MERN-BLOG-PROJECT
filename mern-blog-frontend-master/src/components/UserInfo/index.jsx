import React from 'react';
import styles from './UserInfo.module.scss';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
};

export const UserInfo = ({ avatarURL, fullName, additionalText }) => {
  const navigate = useNavigate();
  const formattedDate = formatDate(additionalText);

  return (
    <div className={styles.root}>
      <Avatar sx={{ width: 50, height: 50 }} src={`http://localhost:8000${avatarURL}`} onClick={() => window.location.href = `http://localhost:8000${avatarURL}`}/>
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{formattedDate}</span>
      </div>
    </div>
  );
};
