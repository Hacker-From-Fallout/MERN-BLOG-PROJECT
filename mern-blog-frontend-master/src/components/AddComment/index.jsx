import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios.js";

import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";

import {
  clearAnswerFor,
  clearCommentParentId,
  clearIsEditing,
  clearCommentChildId,
} from "../../redux/slices/createComments";

import { fetchComments } from "../../redux/slices/comments";

export const Index = ({ updatePostData }) => {
  const [text, setText] = useState('');
  const userData = useSelector((state) => state.auth.data);
  const fullName = userData ? userData.fullName : null;
  const avatarURL = userData ? userData.avatarURL : null;
  const params = useParams();
  const dispatch = useDispatch();

  const answerFor = useSelector((state) => state.commentsCreate.answerFor.value);
  const isEditing = useSelector((state) => state.commentsCreate.isEditing.value);
  const oldText = useSelector((state) => state.commentsCreate.isEditing.oldText);
  const commentParentId = useSelector((state) => state.commentsCreate.commentParentId.value);
  const commentChildId = useSelector((state) => state.commentsCreate.commentChildId.value);

  useEffect(() => {
    if (isEditing) {
      setText(oldText);
    }
  }, [isEditing, oldText]);

  const handleClearValue = () => {
    dispatch(clearAnswerFor());
    dispatch(clearCommentParentId());
    dispatch(clearCommentChildId());
  };

  const clearIsEditingValue = () => {
    dispatch(clearIsEditing());
  };

  const onSubmit = async () => {
    try {
      const fields = {
        text,
        answerFor,
        commentParentId,
        commentChildId,
        fullName,
        avatarURL,
      };

      if (isEditing) {
        await axios.patch(`/posts/${params.id}/comments`, fields);
      } else {
        await axios.post(`/posts/${params.id}/comments`, fields);
      }

      updatePostData();
      setText('');
      dispatch(fetchComments());
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании комментария!");
    }
  };

  return (
    <div className={styles.root}>
      <Avatar
        className={styles.avatar}
        src={`http://localhost:8000${avatarURL}`}
        onClick={() => (window.location.href = `http://localhost:8000${avatarURL}`)}
        sx={{ width: 50, height: 50 }}
      />
      <div className={styles.form}>
        {answerFor && !isEditing && (
          <div className={styles.answerFor}>
            <span className={styles.answerUser}>{"Ответ для пользователя " + answerFor}</span>
            <IconButton style={{ margin: 0 }} onClick={handleClearValue}>
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        {isEditing && (
          <div className={styles.answerFor}>
            <span className={styles.answerUser}>{"Обновление комментария"}</span>
            <IconButton style={{ margin: 0 }} onClick={clearIsEditingValue}>
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        <TextField
          label="Написать комментарий"
          variant="outlined"
          placeholder="Текст комментария..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxRows={10}
          multiline
          fullWidth
        />
        <Button variant="contained" onClick={onSubmit}>
          Отправить
        </Button>
      </div>
    </div>
  );
};



// import React from "react";
// import { useParams } from "react-router-dom";

// import styles from "./AddComment.module.scss";

// import TextField from "@mui/material/TextField";
// import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import DeleteIcon from '@mui/icons-material/Clear';
// import IconButton from '@mui/material/IconButton';
// import { useState } from "react";

// import axios from "../../axios.js";

// import { fetchComments } from '../../redux/slices/comments.js';
// import { useDispatch, useSelector } from 'react-redux';
// import { clearAnswerFor } from '../../redux/slices/createComments';
// import { clearCommentParentId } from "../../redux/slices/createComments";
// import { clearIsEditing } from "../../redux/slices/createComments.js";
// import { clearCommentChildId } from "../../redux/slices/createComments.js";

// export const Index = ( { updatePostData } ) => {
//   const [text, setText] = useState('');
//   const userData = useSelector((state) => state.auth.data);
//   const fullName = userData ? userData.fullName : null;
//   const avatarURL = userData ? userData.avatarURL : null;
//   const params = useParams();
//   const dispatch = useDispatch();

//   const answerFor = useSelector(state => state.commentsCreate.answerFor.value);
//   const isEditing = useSelector(state => state.commentsCreate.isEditing.value);
//   const oldText = useSelector(state => state.commentsCreate.isEditing.oldText);
//   const commentParentId = useSelector(state => state.commentsCreate.commentParentId.value);
//   const commentChildId = useSelector(state => state.commentsCreate.commentChildId.value);

//   React.useEffect(() => {
//     if (isEditing) {
//       setText(oldText);
//     }
//   }, [oldText])

//   // Удаляем значение
//   const handleClearValue = () => {
//     dispatch(clearAnswerFor());
//     dispatch(clearCommentParentId());
//     dispatch(clearCommentChildId());
//   };

//   const clearIsEditingValue = () => {
//     dispatch(clearIsEditing());
//   }

//   const onSubmit = async () => {
//     try {

//         if (isEditing) {
//           const fields = {
//             text,
//             answerFor,
//             commentChildId,
//             commentParentId,
//           };

//           const { data } = await axios.patch(`/posts/${params.id}/comments`, fields);
//         }

//         if (answerFor && !isEditing) {
//           const fields = {
//             text,
//             fullName,
//             avatarURL,
//             answerFor,
//             commentParentId,
//           };

//           const { data } = await axios.post(`/posts/${params.id}/comments`, fields);
//         } 
        
//         if (!answerFor && !isEditing) {
//           const fields = {
//             text,
//             fullName,
//             avatarURL,
//           };
    
//           const { data } = await axios.post(`/posts/${params.id}/comments`, fields);
//         }

//         // Вызов функции для обновления данных статьи в компоненте FullPost
//         updatePostData();
//         setText('');
//         dispatch(fetchComments()); // Загружаем комментарии

//     } catch (err) {
//       console.log(err);
//       alert('Ошибка при создании комментария!');
//     }
//   }

//   return (
//     <>
//       <div className={styles.root}>
//         <Avatar
//           classes={{ root: styles.avatar }}
//           src={`http://localhost:8000${avatarURL}`} 
//           onClick={() => window.location.href = `http://localhost:8000${avatarURL}`}
//           sx={{ width: 50, height: 50 }}
//         />
//         <div className={styles.form}>
//           { answerFor && !isEditing ? (<div className={styles.answerFor}>
//             <span className={styles.answerUser}>{"Ответ для пользователя " + answerFor}</span> 
//             <IconButton style={{margin: 0}}>
//               <DeleteIcon onClick={() => handleClearValue(null)}></DeleteIcon> 
//             </IconButton>
//           </div>) : null
//           }
//           { isEditing ? (<div className={styles.answerFor}>
//             <span className={styles.answerUser}>{"Обновление комментария"}</span> 
//             <IconButton style={{margin: 0}}>
//               <DeleteIcon onClick={() => clearIsEditingValue()}></DeleteIcon> 
//             </IconButton>
//             {console.log(oldText)}
//           </div>) : null
//           }
//           <TextField
//             label="Написать комментарий"
//             variant="outlined"
//             placeholder="Текст комментария..."
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             maxRows={10}
//             multiline
//             fullWidth
//           />
//           <Button variant="contained" onClick={onSubmit}>Отправить</Button>
//         </div>
//       </div>
//     </>
//   );
// };