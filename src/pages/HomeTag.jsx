import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlockHome } from '../components/index.js';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { fetchComments } from '../redux/slices/comments.js';

export const HomeTag = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const params = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const isCommentsLoading = comments.status === 'loading';
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, []);

  const handleTabChange = (event, newValue) => setSelectedTab(newValue);

  const postsWithTags = posts.items.filter(post => post.tags.includes(params.name));

  const postsPopularWithTags = [...postsWithTags].sort((a, b) => b.viewsCount - a.viewsCount);

  const lastComment = comments.items.flat().slice(0, 10);

  const tabData = [
    { items: isPostsLoading ? [...Array(5)] : postsWithTags, commentsCountKey: 'commentsCount' },
    { items: isPostsLoading ? [...Array(5)] : postsPopularWithTags, commentsCountKey: 'commentsCount' },
  ];

  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemIcon>
            <TagIcon style={{ fontSize: 52, color: 'black' }} />
          </ListItemIcon>
          <ListItemText primary={<Typography fontWeight={"bold"} variant="h4">{params.name}</Typography>}/>
        </ListItem>
      </List>
      <Tabs style={{ marginBottom: 15 }} value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      
      <Grid container spacing={4}>
        <Grid item xs={8}>
          {tabData[selectedTab].items.map((obj, index) => (
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageURL ? `http://localhost:8000${obj.imageURL}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj[tabData[selectedTab].commentsCountKey]}
                tags={obj.tags}
                isEditable={userData && userData._id === obj.user._id}
              />
            )
          ))}
        </Grid>
        
        <Grid item xs={4}>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlockHome
            items={lastComment}
            isLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};

// import React from 'react';
// import { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Grid from '@mui/material/Grid';
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import TagIcon from "@mui/icons-material/Tag";
// import ListItemText from "@mui/material/ListItemText";
// import Typography from "@mui/material/Typography";

// import { Post } from '../components/Post';
// import { TagsBlock } from '../components/TagsBlock';
// import { CommentsBlock } from '../components/CommentsBlock';
// import { fetchPosts, fetchTags } from '../redux/slices/posts';
// import { fetchComments } from '../redux/slices/comments.js';

// export const HomeTag = () => {
//   const [selectedTab, setSelectedTab] = useState(0);
//   const params = useParams();
//   const dispatch = useDispatch();
//   const userData = useSelector((state) => state.auth.data);
//   const { posts, tags } = useSelector((state) => state.posts);
//   const { comments } = useSelector((state) => state.comments);
//   const isCommentsLoading = comments.status === 'loading';
//   const isPostsLoading = posts.status === 'loading';
//   const isTagsLoading = tags.status === 'loading';

//   React.useEffect(() => {
//     // Получаем посты и теги
//     dispatch(fetchPosts());
//     dispatch(fetchTags());
//   }, []);

//   React.useEffect(() => {
//     // Загружаем комментарии
//     dispatch(fetchComments());
//   }, []);

//   const handleTabChange = (event, newValue) => {
//     setSelectedTab(newValue);
//   }

//   // Фильтруем посты по тегам
//   const postsWithTags = posts.items.filter((post) => {
//     return post.tags.includes(params.name);
//   });

//   // Создаем копию отфильтрованного массива постов и сортируем
//   const postsPopularWithTags = [...postsWithTags];
//   postsPopularWithTags.sort((a, b) => b.viewsCount - a.viewsCount);

//   const lastComment = comments.items
//             .map((obj) => obj)
//             .flat()
//             .slice(0, 10);

//   // Стили для большой иконки
//   const largeIconStyles = {
//     fontSize: 52,
//     color: 'black',
//   };

//   return (
//     <>
//       <List>
//         <ListItem disablePadding>
//           <ListItemIcon>
//             <TagIcon style={largeIconStyles} />
//           </ListItemIcon>
//           <ListItemText primary={<Typography fontWeight={"bold"} variant="h4">{params.name}</Typography>}/>
//         </ListItem>
//       </List>
//       <Tabs style={{ marginBottom: 15 }} value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example">
//         <Tab label="Новые" />
//         <Tab label="Популярные" />
//       </Tabs>
//       { selectedTab === 0 && (
//         <Grid container spacing={4}>
//         <Grid xs={8} item>
//           {(isPostsLoading ? [...Array(5)] : postsWithTags).map((obj, index) => 
//             isPostsLoading ? ( 
//               <Post key={index} isLoading={true} /> 
//             ) : (
//               <Post
//                 id={obj._id}
//                 title={obj.title}
//                 imageUrl={obj.imageURL ? `http://localhost:8000${obj.imageURL}` : ""}
//                 user={obj.user}
//                 createdAt={obj.createdAt}
//                 viewsCount={obj.viewsCount}
//                 commentsCount={3}
//                 tags={obj.tags}
//                 isEditable={userData?._id === obj.user._id}/>
//             ),
//           )}
//         </Grid>
//         <Grid xs={4} item>
//           <TagsBlock items={tags.items} isLoading={isTagsLoading} />
//           <CommentsBlock
//             items={lastComment}
//             isLoading={isCommentsLoading}
//           />
//         </Grid>
//       </Grid>
//       )}
//       { selectedTab === 1 && (
//         <Grid container spacing={4}>
//         <Grid xs={8} item>
//           {(isPostsLoading ? [...Array(5)] : postsPopularWithTags).map((obj, index) => 
//             isPostsLoading ? ( 
//               <Post key={index} isLoading={true} /> 
//             ) : (
//               <Post
//                 id={obj._id}
//                 title={obj.title}
//                 imageUrl={obj.imageURL ? `http://localhost:8000${obj.imageURL}` : ""}
//                 user={obj.user}
//                 createdAt={obj.createdAt}
//                 viewsCount={obj.viewsCount}
//                 commentsCount={3}
//                 tags={obj.tags}
//                 isEditable={userData?._id === obj.user._id}/>
//             ),
//           )}
//         </Grid>
//         <Grid xs={4} item>
//           <TagsBlock items={tags.items} isLoading={isTagsLoading} />
//           <CommentsBlock
//             items={lastComment}
//             isLoading={isCommentsLoading}
//           />
//         </Grid>
//       </Grid>
//       )}
//     </>
//   );
// };