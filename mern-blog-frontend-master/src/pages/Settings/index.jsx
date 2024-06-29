import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import axios from '../../axios';
import styles from './Login.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';

export const Settings = () => {
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const params = useParams();
  const inputFileRef = React.useRef(null);
  const { handleSubmit, formState: { errors, isValid}, } = useForm();
  const userData = useSelector((state) => state.auth.data);
  const fullName = userData ? userData.fullName : null;
  const avatarURL = userData ? userData.avatarURL : null;

  React.useEffect(() => {
    axios
    .get(`/auth/me`)
    .then(({ data }) => { setAvatarUrl(data.avatarURL); })
    .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении пользователя!');
      });
    }, [])

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/uploadUser', formData);
      setAvatarUrl(data.url);
    } catch (err) {
      console.log(err);
      alert('Ошибка при загрузке файла!');
    }
  };

  const onClickRemoveImage = () => {
    setAvatarUrl('');
  };

  const onSubmit = async (values) => {

    const { data } = await axios.patch(`/setting/${params.id}`, { avatarUrl });

    alert("Обновление аккаунта прошло успешно!")
    navigate('/');
  };

  if (!window.localStorage.getItem('token') && !isAuth) {
    return navigate('/');
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Настройки аккаунта
      </Typography>
      <Typography classes={{ root: styles.name }} variant="h6">
        {fullName}
      </Typography>
      <div className={styles.avatar}>
        {avatarUrl ? (
          <div>
            <div className={styles.button}>
              <Avatar sx={{ width: 100, height: 100 }} src={`http://localhost:8000${avatarUrl}`} alt="Uploaded" onClick={() => window.location.href = `http://localhost:8000${avatarUrl}`}/>
            </div> 
            <Button variant="contained" color="error" onClick={onClickRemoveImage} sx={{ width: '100%' }}>Удалить</Button>
          </div>
        ) : (<Avatar sx={{ width: 100, height: 100 }} src={`http://localhost:8000${avatarUrl}`} onClick={() => window.location.href = `http://localhost:8000${avatarUrl}`}/>)
        }
      </div>
      <div className={styles.button}>
        <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large" fullWidth>
          Загрузить превью
        </Button>
        <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
          Сохранить
        </Button>
      </form>
    </Paper>
  );
};




