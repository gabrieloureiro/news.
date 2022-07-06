import { AuthProvider, LanguageProvider } from "context";
import { IntlProvider, ChakraProvider, QueryClientProvider } from "providers";

export const AppProvider: React.FC = ({ children }) => {
  return (
    <LanguageProvider>
      <QueryClientProvider>
        <IntlProvider>
          <ChakraProvider>
            <AuthProvider>{children}</AuthProvider>
          </ChakraProvider>
        </IntlProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
};
