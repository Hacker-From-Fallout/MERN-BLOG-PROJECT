import React from "react";
import { Link } from "react-router-dom";

// Material-UI components
import Skeleton from "@mui/material/Skeleton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

// Other components
import { SideBlock } from "../SideBlock";

// Styles
import styles from './CommentsBlockHome.module.scss';

export const CommentsBlockHome = ({ items = [], children, isLoading = true, updatePostData }) => {
  const safeGetUser = (obj) => (obj && obj.user) ? obj.user : {};
  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => {
          const user = safeGetUser(obj);

          // Проверка на существование obj и obj.postId
          const postIdLink = obj && obj.postId ? `/posts/${obj.postId}` : '/';

          return (
            <Link to={postIdLink} key={index} className={styles.wrapper}>
              <React.Fragment>
                <ListItem alignItems="flex-start" className={styles.root}>
                  <ListItemAvatar>
                    {isLoading ? (
                      <Skeleton variant="circular" width={50} height={50} />
                    ) : (
                      <Avatar
                        alt={user.fullName}
                        src={user.avatarURL ? `http://localhost:8000${user.avatarURL}` : ''}
                        sx={{ width: 50, height: 50 }}
                        onClick={() => user.avatarURL && (window.location.href = `http://localhost:8000${user.avatarURL}`)}
                      />
                    )}
                  </ListItemAvatar>
                  {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Skeleton variant="text" height={25} width={120} />
                      <Skeleton variant="text" height={18} width={230} />
                    </div>
                  ) : (
                    <div className={styles.userDetail}>
                      <ListItemText
                        primary={<span className={styles.userName}>{user.fullName}</span>}
                        secondary={<span className={styles.additional}>{obj.text}</span>}
                      />
                    </div>
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            </Link>
          );
        })}
      </List>
      {children}
    </SideBlock>
  );
};






// import React from "react";
// import { useState } from 'react';
// import { useSelector } from "react-redux";
// import { useDispatch } from 'react-redux';
// import { addAnswerFor } from '../../redux/slices/createComments';
// import { addCommentParentId } from "../../redux/slices/createComments";
// import { clearCommentChildId } from "../../redux/slices/createComments";
// import { fetchRemoveComment } from "../../redux/slices/comments";
// import { fetchComments } from "../../redux/slices/comments";
// import { Link } from "react-router-dom";
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Clear';
// import EditIcon from '@mui/icons-material/Edit';
// import ReplyIcon from '@mui/icons-material/Reply';
// import Skeleton from "@mui/material/Skeleton";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemAvatar from "@mui/material/ListItemAvatar";
// import Avatar from "@mui/material/Avatar";
// import ListItemText from "@mui/material/ListItemText";
// import Divider from "@mui/material/Divider";
// import axios from '../../axios';
// import { SideBlock } from "../SideBlock";
// import { animateScroll as scroll } from 'react-scroll';
// import { CommentsChildrenBlock } from '../CommentsBlockChildren';
// import { addIsEditing } from "../../redux/slices/createComments";
// import { formatDate } from '../UserInfo/index'
// import { useParams } from "react-router-dom";
// import Typography from "@mui/material/Typography";
// import styles from './CommentsBlock.module.scss';

// export const CommentsBlock = ({ items = [], children, isLoading = true, updatePostData }) => {
//   const dispatch = useDispatch();
//   const safeGetUser = (obj) => (obj && obj.user) ? obj.user : {};
//   const userData = useSelector((state) => state.auth.data);
//   const userId = userData ? userData._id : null;
//   const params = useParams();

//   const scrollToBottom = () =>  {
//     // Используем метод нативного JavaScript для получения максимального значения прокрутки
//     const scrollHeight = document.documentElement.scrollHeight;
//     const clientHeight = document.documentElement.clientHeight;
//     const maxScrollHeight = scrollHeight - clientHeight;

//     // Используем react-scroll для плавной анимации до самого низа
//     scroll.scrollTo(maxScrollHeight);
//   }

//   // Добавляем значение
//   const handleAddValue = (fullName, commentParentId) => {
//     dispatch(addAnswerFor(fullName));
//     dispatch(addCommentParentId(commentParentId));
//     scrollToBottom();
//   };

//   const addIsEditingValue = (oldText, commentParentId) => {
//     dispatch(addIsEditing(oldText));
//     dispatch(addCommentParentId(commentParentId));
//     dispatch(clearCommentChildId());
//     scrollToBottom();
//   }

//   const onClickRemove = async (commentParentId, commentChildId) => {
//     const id = params.id;
//     const commentIsChild = false;
//     const fields = {
//       commentParentId,
//       commentChildId,
//       commentIsChild,
//     }

//     if (window.confirm('Вы действительно хотите удалить комментарий?')) {
//       const { data } = await axios.put(`/posts/${id}/comments`, fields);
//     }

//     updatePostData();
//     dispatch(fetchComments()); // Загружаем комментарии
//   };

//   return (
//     <SideBlock title="Комментарии">
//       <List>
//         {(isLoading ? [...Array(5)] : items).map((obj, index) => {
//           const user = safeGetUser(obj);

//           return (
//             <React.Fragment key={index}>
//               <ListItem alignItems="flex-start" className={styles.root}>
//                 <div className={styles.editButtons}>
//                   <IconButton onClick={() => handleAddValue(user.fullName, obj._id)}>
//                     <ReplyIcon color="primary" />
//                   </IconButton>
//                   {userId && user._id && userId === user._id && (
//                     <>
//                       <IconButton color="primary" onClick={() => addIsEditingValue(obj.text, obj._id)}>
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton color="secondary" onClick={() => onClickRemove(obj._id, null)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </>
//                   )}
//                 </div>
//                 <ListItemAvatar>
//                   {isLoading ? (
//                     <Skeleton variant="circular" width={50} height={50} />
//                   ) : (
//                     <Avatar
//                       alt={user.fullName}
//                       src={user.avatarURL ? `http://localhost:8000${user.avatarURL}` : ''}
//                       sx={{ width: 50, height: 50 }}
//                       onClick={() => user.avatarURL && (window.location.href = `http://localhost:8000${user.avatarURL}`)}
//                     />
//                   )}
//                 </ListItemAvatar>
//                 {isLoading ? (
//                   <div style={{ display: 'flex', flexDirection: 'column' }}>
//                     <Skeleton variant="text" height={25} width={120} />
//                     <Skeleton variant="text" height={18} width={230} />
//                   </div>
//                 ) : (
//                   <div className={styles.userDetail}>
//                     <ListItemText
//                       primary={<div className={styles.nameContainer}>
//                         <span className={styles.userName}>{user.fullName}</span>
//                         <Typography className={styles.createdAt}>{formatDate(obj.createdAt)}</Typography>
//                         </div>}
//                       secondary={<span className={styles.additional}>{obj?.text}</span>}
//                     />
//                     <CommentsChildrenBlock 
//                       items={obj.children} 
//                       isLoading={isLoading} 
//                       commentParentId={obj._id}
//                       updatePostData={updatePostData}/>
//                   </div>
//                 )}
//               </ListItem>
//               <Divider variant="inset" component="li" />
//             </React.Fragment>
//           );
//         })}
//       </List>
//       {children}
//     </SideBlock>
//   );
// };