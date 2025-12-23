import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Eureka from './Eureka';
import EurekaLesson from './EurekaLesson';
import StardustPage from './StardustPage';

export default function MainApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Eureka />} />
                <Route path="/lesson" element={<EurekaLesson />} />
                <Route path="/stardust" element={<StardustPage />} />
            </Routes>
        </BrowserRouter>
    );
}
