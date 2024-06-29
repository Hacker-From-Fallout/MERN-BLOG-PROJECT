import { createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

const initialState = {
    answerFor: {
        value: null,
    },
    commentParentId: {
        value: null,
    },
    commentChildId: {
        value: null,
    },
    isEditing: {
        value: false,
        oldText: '',
    },
};

const commentsCreateSlice = createSlice({
    name: 'commentsCreate',
    initialState,
    reducers: {
        addAnswerFor(state, action) {
            state.answerFor.value = action.payload;
        },
        clearAnswerFor(state) {
            state.answerFor.value = null;
        },
        addCommentParentId(state, action) {
            state.commentParentId.value = action.payload;
        },
        clearCommentParentId(state) {
            state.commentParentId.value = null;
        },
        addCommentChildId(state, action) {
            state.commentChildId.value = action.payload;
        },
        clearCommentChildId(state) {
            state.commentChildId.value = null;
        },
        addIsEditing(state, action) {
            state.isEditing.value = true;
            state.isEditing.oldText = action.payload;
        },
        clearIsEditing(state) {
            state.isEditing.value = false;
            state.isEditing.oldText = '';
        },
    },
});

export const {  addAnswerFor,
                clearAnswerFor, 
                addCommentParentId, 
                clearCommentParentId, 
                addIsEditing, 
                clearIsEditing,
                addCommentChildId, 
                clearCommentChildId } = commentsCreateSlice.actions;
export const commentsCreateReducer = commentsCreateSlice.reducer;