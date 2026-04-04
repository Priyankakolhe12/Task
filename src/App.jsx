import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./Routes/AppRouter";
import { AuthProvider } from "./Context/AuthProvider";
import { SnackbarProvider } from "notistack";
import { KYCProvider } from "./Context/KYCProvider";

const App = () => {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <KYCProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </KYCProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
};

export default App;
