import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlockHome } from '../components/index.js';
import { fetchPosts, fetchTags } from '../redux/slices/posts.js';
import { fetchComments } from '../redux/slices/comments.js';

export const Home = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const isCommentsLoading = comments.status === 'loading';
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const postsPopular = [...posts.items].sort((a, b) => b.viewsCount - a.viewsCount);

  const lastComment = comments.items.flat().slice(0, 10);

  const tabData = [
    { items: isPostsLoading ? [...Array(5)] : posts.items, commentsCountKey: 'commentsCount' },
    { items: isPostsLoading ? [...Array(5)] : postsPopular, commentsCountKey: 'commentsCount' },
  ];

  return (
    <>
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
                childrenMin={obj.text}
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
// import { useDispatch, useSelector } from 'react-redux';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Grid from '@mui/material/Grid';

// import { Post } from '../components/Post';
// import { TagsBlock } from '../components/TagsBlock';
// import { CommentsBlock } from '../components/CommentsBlock';
// import { fetchPosts, fetchTags } from '../redux/slices/posts.js';
// import { fetchComments } from '../redux/slices/comments.js';

// export const Home = () => {
//   const [selectedTab, setSelectedTab] = useState(0);
//   const dispatch = useDispatch();
//   const userData = useSelector((state) => state.auth.data);
//   const { posts, tags } = useSelector((state) => state.posts);
//   const { comments } = useSelector((state) => state.comments);
//   const isCommentsLoading = comments.status === 'loading';
//   const isPostsLoading = posts.status === 'loading';
//   const isTagsLoading = tags.status === 'loading';
  
//   React.useEffect(() => {
//     dispatch(fetchPosts());
//     dispatch(fetchTags());
//     dispatch(fetchComments());
//   }, []);

//   const handleTabChange = (event, newValue) => {
//     setSelectedTab(newValue);
//   }

//   const postsPopular = [...posts.items];
//   postsPopular.sort((a, b) => b.viewsCount - a.viewsCount);

//   const lastComment = comments.items
//             .map((obj) => obj)
//             .flat()
//             .slice(0, 10);
  
//   return (
//     <>
//       <Tabs style={{ marginBottom: 15 }} value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example">
//         <Tab label="Новые" />
//         <Tab label="Популярные" />
//       </Tabs>
//       { selectedTab === 0 && (
//         <Grid container spacing={4}>
//         <Grid xs={8} item>
//           {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => 
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
//                 commentsCount={obj.commentsCount}
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
//           {(isPostsLoading ? [...Array(5)] : postsPopular).map((obj, index) => 
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
