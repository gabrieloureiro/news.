import { AuthProvider, LanguageProvider } from "context";
import { IntlProvider, ChakraProvider, QueryClientProvider } from "providers";

export const AppProvider: React.FC = ({ children }) => {
  return (
    <LanguageProvider>
      <QueryClientProvider>
        <IntlProvider>
          <AuthProvider>
            <ChakraProvider>{children}</ChakraProvider>
          </AuthProvider>
        </IntlProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
};
