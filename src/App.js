import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import MainPage from './component/page/MainPage';
import PostWritePage from './component/page/PostWritePage';
import PostViewPage from './component/page/PostViewPage';
import Login from './component/page/LoginPage';
import Join from './component/page/Join';





function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route index element={<Login/>}/>
        <Route path='MainPage' element={<MainPage />} />
        <Route path='Join' element={<Join/>}/>
        <Route path="post-write" element={<PostWritePage />} />
        <Route path="post/:postId" element={<PostViewPage />} />
    </Routes>
</BrowserRouter>
  );
}

export default App;
