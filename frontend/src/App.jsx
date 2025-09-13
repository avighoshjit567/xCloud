import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { MantineProvider, Button, Container, Title } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
import AppRoutes from "./components/AppRoutes";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <Notifications />
        <AppRoutes />
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;