import { useState } from "react";
import { Button, Container, Typography } from "@mui/material";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        React + Vite + Material UI
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Số lần bấm: {count}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => setCount(count + 1)}
      >
        Bấm vào tôi
      </Button>
    </Container>
  );
}

export default App;
