import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments } from '../redux/slices/comments.js';

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock/index.jsx";
import axios from "../axios.js";
import ReactMarkdown from "react-markdown";


export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comments);

  const isCommentsLoading = comments.status === 'loading';

  const fetchData = () => {
    axios.get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert('Ошибка при получении статьи');
      });
  };

  React.useEffect(() => {
    fetchData(); // Вызываем функцию для загрузки данных после монтирования компонента
    dispatch(fetchComments()); // Загружаем комментарии
  }, []);

  // Фильтруем комментарии для текущего поста
  const postComments = comments.items.filter((comment) => comment.postId === id);
  console.log(postComments)

  if (isLoading) {
    return <Post isLoading={true} />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageURL ? `http://localhost:8000${data.imageURL}` : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.commentsCount}
        tags={data.tags}
        isFullPost>
        <ReactMarkdown>{data.text}</ReactMarkdown>
      </Post>
      <CommentsBlock
        items={postComments}
        isLoading={isCommentsLoading}
        updatePostData={fetchData}
      >
        <Index updatePostData={fetchData} />
      </CommentsBlock>
    </>
  );
};

