import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import axios from '../../axios';
import styles from './Login.module.scss';
import { fetchRegister } from '../../redux/slices/auth';

export const Registration = () => {
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const navigate = useNavigate();
  const inputFileRef = React.useRef(null);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isValid}, } = useForm({
    defaultValues: {
      fullName: 'Вася Пупкин',
      email: 'vasya@test.ru',
      password: '1234',
    },
    mode: 'onChange',
  });

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

  const hasTwoWords = (str) => {
    // Удаляем начальные и конечные пробелы
    str = str.trim();
    // Проверяем, содержит ли строка пробел
    if (str.includes(" ")) {
        // Разделяем строку на массив слов, используя пробел как разделитель, и проверяем количество элементов в массиве
        const words = str.split(" ");
        return words.length === 2;
    } else {
        return false; // Если нет пробелов, значит в строке только одно слово или пустая строка
    }
  }

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister({ ...values, avatarUrl }));

    if (!data.payload) {
      return alert('Не удалось зарегистрироваться!');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }

    if (window.confirm("Регистрация прошла успешно!")) {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        {avatarUrl ? (
          <div>
            <div className={styles.button}>
              <Avatar sx={{ width: 100, height: 100 }} src={`http://localhost:8000${avatarUrl}`} alt="Uploaded" />
            </div> 
            <Button variant="contained" color="error" onClick={onClickRemoveImage} sx={{ width: '100%' }}>Удалить</Button>
          </div>
        ) : (<Avatar sx={{ width: 100, height: 100 }} />)
        }
      </div>
      <div className={styles.button}>
        <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large" fullWidth>
          Загрузить превью
        </Button>
        <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField 
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', 
            { required: 'Укажите полное имя',
              validate: value => hasTwoWords(value) || 'Поле должно содержать ровно два слова'
            })}
          className={styles.field}
          label="Полное имя"
          fullWidth 
        />
        <TextField 
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type='email'
          {...register('email', { required: 'Укажите почту' })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField 
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type='password'
          {...register('password', { required: 'Укажите пароль' })}
          className={styles.field}
          label="Пароль"
          fullWidth  
        />
        <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};




