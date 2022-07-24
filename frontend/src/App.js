import './App.css';
import {Homepage} from './components/Homepage.js'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {CssBaseline} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">
      <Homepage />
    </div>
    </ThemeProvider>

  );
}

export default App;
