import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addAnswerFor,
  addCommentParentId,
  addIsEditing,
  addCommentChildId,
} from "../../redux/slices/createComments";
import { fetchComments } from "../../redux/slices/comments";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  List,
  Skeleton,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Reply as ReplyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import axios from "../../axios";
import { formatDate } from "../UserInfo/index";
import { useParams } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import styles from "./CommentsChildrenBlock.module.scss";

export const CommentsChildrenBlock = ({
  items,
  children,
  isLoading = true,
  commentParentId,
  updatePostData,
}) => {
  const [showChildrenComments, setShowChildrenComments] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const userData = useSelector((state) => state.auth.data);
  const userId = userData ? userData._id : null;
  const countChild = items.length;

  const scrollToBottom = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const maxScrollHeight = scrollHeight - clientHeight;
    scroll.scrollTo(maxScrollHeight);
  };

  const addIsEditingValue = (oldText, commentChildId, commentParentId) => {
    dispatch(addIsEditing(oldText));
    dispatch(addCommentChildId(commentChildId));
    dispatch(addCommentParentId(commentParentId));
    scrollToBottom();
  };

  const handleAddValue = (fullName, commentParentId) => {
    dispatch(addAnswerFor(fullName));
    dispatch(addCommentParentId(commentParentId));
    scrollToBottom();
  };

  const onClickRemove = async (commentParentId, commentChildId) => {
    const id = params.id;
    const fields = {
      commentParentId,
      commentChildId,
      commentIsChild: true,
    };

    if (window.confirm("Вы действительно хотите удалить комментарий?")) {
      await axios.put(`/posts/${id}/comments`, fields);
      updatePostData();
      dispatch(fetchComments());
    }
  };

  return (
    <div>
      <span className={styles.userName}>{"Ответы"}</span>
      {showChildrenComments ? (
        <IconButton onClick={() => setShowChildrenComments(false)}>
          <ExpandLessIcon color="primary" />
        </IconButton>
      ) : (
        <IconButton
          className={styles.showButtons}
          onClick={() => setShowChildrenComments(true)}
        >
          <ExpandMoreIcon color="primary" />
        </IconButton>
      )}
      <span className={styles.countChild}>{`(${countChild})`}</span>

      {showChildrenComments && (
        <List disablePadding>
          {(isLoading ? [...Array(2)] : items).map((obj, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" className={styles.root}>
                <div className={styles.editButtons}>
                  <IconButton onClick={() => handleAddValue(obj.fullName, commentParentId)}>
                    <ReplyIcon color="primary" />
                  </IconButton>
                  {userId && obj.user && userId === obj.user._id && (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() =>
                          addIsEditingValue(obj.text, obj._id, commentParentId)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => onClickRemove(commentParentId, obj._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </div>
                <ListItemAvatar>
                  {isLoading ? (
                    <Skeleton variant="circular" width={50} height={50} />
                  ) : (
                    <Avatar
                      alt={obj.fullName}
                      src={
                        obj.user.avatarURL
                          ? `http://localhost:8000${obj.user.avatarURL}`
                          : ""
                      }
                      sx={{ width: 50, height: 50 }}
                      onClick={() =>
                        (window.location.href = `http://localhost:8000${obj.user.avatarURL}`)
                      }
                    />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  <div className={styles.userDetail}>
                    <ListItemText
                      primary={
                        <div className={styles.answerForContainer}>
                          <span className={styles.userName}>{obj.fullName}</span>
                          <Typography className={styles.answerFor}>
                            {`(Ответ для пользователя ${obj.answerFor})`}
                          </Typography>
                          <Typography className={styles.createdAt}>
                            {formatDate(obj.createdAt)}
                          </Typography>
                        </div>
                      }
                      secondary={<span className={styles.additional}>{obj.text}</span>}
                    />
                  </div>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
      {children}
    </div>
  );
};




// import React from "react";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { useDispatch } from 'react-redux';
// import { addAnswerFor } from '../../redux/slices/createComments';
// import { addCommentParentId } from "../../redux/slices/createComments";
// import { fetchComments } from "../../redux/slices/comments";
// import { addIsEditing } from "../../redux/slices/createComments.js";
// import { addCommentChildId } from "../../redux/slices/createComments";
// import ListItem from "@mui/material/ListItem";
// import ListItemAvatar from "@mui/material/ListItemAvatar";
// import Avatar from "@mui/material/Avatar";
// import ListItemText from "@mui/material/ListItemText";
// import Divider from "@mui/material/Divider";
// import List from "@mui/material/List";
// import Skeleton from "@mui/material/Skeleton";
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Clear';
// import EditIcon from '@mui/icons-material/Edit';
// import ReplyIcon from '@mui/icons-material/Reply';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import Typography from "@mui/material/Typography";
// import axios from '../../axios';
// import { useParams } from "react-router-dom";
// import { animateScroll as scroll } from 'react-scroll';
// import { Link } from "react-router-dom";
// import { formatDate } from '../UserInfo/index'
// import styles from './CommentsChildrenBlock.module.scss';

// export const CommentsChildrenBlock = ({ items, children, isLoading = true, commentParentId, updatePostData }) => {
//   const [showChildrenComments, setShowChildrenComments] = useState(false);
//   const dispatch = useDispatch();
//   const params = useParams();
//   const safeGetUser = (obj) => (obj && obj.user) ? obj.user : {};
//   const userData = useSelector((state) => state.auth.data);
//   const userId = userData ? userData._id : null;
//   const countChild = items.length;

//   const scrollToBottom = () =>  {
//     // Используем метод нативного JavaScript для получения максимального значения прокрутки
//     const scrollHeight = document.documentElement.scrollHeight;
//     const clientHeight = document.documentElement.clientHeight;
//     const maxScrollHeight = scrollHeight - clientHeight;

//     // Используем react-scroll для плавной анимации до самого низа
//     scroll.scrollTo(maxScrollHeight);
//   }

//   const addIsEditingValue = (oldText, commentChildId, commentParentId) => {
//     dispatch(addIsEditing(oldText));
//     dispatch(addCommentChildId(commentChildId));
//     dispatch(addCommentParentId(commentParentId));
//     scrollToBottom();
//   }

//   //const isEditable = true;
//   const handleAddValue = (fullName, commentParentId) => {
//     dispatch(addAnswerFor(fullName));
//     dispatch(addCommentParentId(commentParentId));
//     scrollToBottom();
//   };

//   const onClickRemove = async (commentParentId, commentChildId) => {
//     const id = params.id;
//     const commentIsChild = true;
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
//     <div>
//       <span className={styles.userName}>{"Ответы"}</span> 

//       {showChildrenComments ? (
//         <IconButton>
//           <ExpandLessIcon color="primary" onClick={() => setShowChildrenComments(false)}></ExpandLessIcon>
//         </IconButton>
//       ) : (
//         <IconButton className={styles.showButtons} onClick={() => setShowChildrenComments(true)}>
//           <ExpandMoreIcon color="primary"></ExpandMoreIcon>
//         </IconButton>
//       )}

//       <span className={styles.countChild}>{`(${countChild})`}</span> 

//       {showChildrenComments ? (
//         <List disablePadding>
//           {(isLoading ? [...Array(2)] : items).map((obj, index) => (
//             <React.Fragment key={index}>
//               <ListItem alignItems="flex-start" className={styles.root}>
//                 <div className={styles.editButtons}>
//                   <IconButton>
//                     <ReplyIcon color="primary" onClick={() => handleAddValue(obj.fullName, commentParentId)}></ReplyIcon>
//                   </IconButton>
//                   {userId && obj.user && userId === obj.user._id && (
//                     <>
//                       <IconButton color="primary" onClick={() => addIsEditingValue(obj.text, obj._id, commentParentId)}>
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton color="secondary">
//                         <DeleteIcon onClick={() => onClickRemove(commentParentId, obj._id)} />
//                       </IconButton>
//                     </>
//                   )}
//                 </div>
//                 <ListItemAvatar>
//                   {isLoading ? (
//                     <Skeleton variant="circular" width={50} height={50} />
//                   ) : (
//                     <Avatar alt={obj.fullName} src={obj.user.avatarURL ? `http://localhost:8000${obj.user.avatarURL}` : ''} sx={{ width: 50, height: 50 }} onClick={() => window.location.href = `http://localhost:8000${obj.avatarURL}`}/>
//                   )}
//                 </ListItemAvatar>
//                 {isLoading ? (
//                   <div style={{ display: "flex", flexDirection: "column" }}>
//                     <Skeleton variant="text" height={25} width={120} />
//                     <Skeleton variant="text" height={18} width={230} />
//                     {console.log(obj.user.avatarURL)}
//                   </div>
//                 ) : (
//                   <div className={styles.userDetail}>
//                     <ListItemText
//                       primary={<div className={styles.answerForContainer}>
//                         <span className={styles.userName}>{obj.fullName}</span>
//                         <Typography className={styles.answerFor}>{`(Ответ для пользователя ${obj.answerFor})`}</Typography>
//                         <Typography className={styles.createdAt}>{formatDate(obj.createdAt)}</Typography>
//                         </div>}
//                       secondary={<span className={styles.additional}>{obj.text}</span>}
//                     />
//                   </div>
//                 )}
//               </ListItem>
//               <Divider variant="inset" component="li" />
//             </React.Fragment>
//           ))}
//         </List>
//       ) : null}
//       {children}
//     </div>
//   );
// };